import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const app = await readFile(new URL('app.js', root), 'utf8');
const submit = await readFile(new URL('submit.js', root), 'utf8');
const index = await readFile(new URL('index.html', root), 'utf8');

// Evaluate the actual builders without running the unrelated feed and animation code.
const loadBuilder = (source, name, next, context = {}) => {
  const start = source.indexOf(`  const ${name} =`);
  const end = source.indexOf(`  const ${next} =`, start);
  assert.ok(start >= 0 && end > start, `${name} must have an identifiable boundary`);
  return vm.runInNewContext(`${source.slice(start, end)}\n${name};`, context);
};
const createPrompt = loadBuilder(app, 'buildCreationPrompt', 'copyText');
const publishPrompt = ({ goal = '', category = '', config = {} } = {}) => loadBuilder(
  submit, 'buildPublishingPrompt', 'updatePrompt',
  { config, agentGoal: { value: goal }, agentCategory: { value: category } }
)();
const reference = {
  title: '参考作品', category: '界面演示', body: '参考介绍', author: 'example',
  url: 'https://github.com/example/gallery/discussions/1',
  sourceUrl: 'https://example.com/reference', sourceMedia: { url: 'https://example.com/demo.mp4' },
  directRepoUrl: 'https://github.com/example/reference',
  repoUrls: ['https://github.com/example/reference', 'https://github.com/example/another'],
  stack: ['React', 'Remotion'], rights: 'MIT code; media separately licensed',
  verification: 'source verified'
};

test('exploration creates a video from the reference, never a publishing workflow', () => {
  const prompt = createPrompt(reference);
  assert.match(prompt, /直接制作一条可播放的视频/);
  assert.match(prompt, /【我的视频需求】/);
  assert.match(prompt, /空工作区可创建/);
  assert.match(prompt, /交付可播放的视频文件/);
  assert.doesNotMatch(prompt, /createDiscussion|gh repo create|gh release|目标 Discussions 仓库|必须自动完成的流程/);
  for (const value of [reference.title, reference.body, reference.url, reference.sourceUrl,
    reference.sourceMedia.url, ...reference.repoUrls, reference.rights, reference.verification]) {
    assert.ok(prompt.includes(value), 'reference context must be preserved');
  }
});

test('exploration keeps user needs verbatim and offers a placeholder when omitted', () => {
  const goal = '制作 15 秒竖屏视频；保留引号 " 和 ${literal}。';
  assert.ok(createPrompt(reference, goal).includes(goal));
  assert.match(createPrompt(reference), /请在这里填写或在粘贴后补充/);
});

test('references without a repository still support creation without invented links', () => {
  const prompt = createPrompt({ title: '仅视频参考', category: '场景叙事', author: 'example' });
  assert.match(prompt, /尚未确认公开仓库/);
  assert.match(prompt, /不要编造仓库地址/);
  assert.doesNotMatch(prompt, /undefined|null|发布后回填/);
});

test('publication uploads existing work and creates a Discussion through gh', () => {
  const prompt = publishPrompt({ config: { owner: 'example', repo: 'gallery', category: 'Show and tell' } });
  for (const command of ['gh auth status', 'gh repo view', 'gh repo create',
    'gh release create', 'gh release upload', 'gh release view --json assets', 'gh api graphql', 'createDiscussion']) {
    assert.ok(prompt.includes(command), `${command} must be included`);
  }
  assert.match(prompt, /目标 Discussions 仓库：example\/gallery/);
  assert.match(prompt, /目标 Discussion 分类：Show and tell/);
  assert.match(prompt, /当前仓库没有可发布的作品，停止/);
  assert.match(prompt, /不重新创作或改写动效/);
  assert.match(prompt, /只有仓库推送、媒体上传和 Discussion 发布全部成功/);
  assert.match(prompt, /不要提交 token、密钥、.env/);
  assert.match(prompt, /不要擅自覆盖或改公开性/);
  assert.match(prompt, /避免重试导致重复发布/);
  assert.doesNotMatch(prompt, /【我的视频需求】|【参考项目：/);
});

test('publication preserves goal and work category independently of the Discussion category', () => {
  const goal = '发布已完成作品；不要执行 $(anything) 或改造画面。';
  const prompt = publishPrompt({ goal, category: '文字排版', config: { owner: 'example', repo: 'gallery', category: 'Showcase' } });
  assert.ok(prompt.includes(goal));
  assert.match(prompt, /作品分类：文字排版/);
  assert.match(prompt, /目标 Discussion 分类：Showcase/);
  assert.match(prompt, /“## GitHub 仓库”/);
  assert.match(prompt, /“## 视频”/);
});

test('publication does not guess a missing target repository', () => {
  assert.match(publishPrompt(), /不要猜测/);
  assert.doesNotMatch(publishPrompt(), /undefined|null/);
});

test('discovery CTA stays in exploration and details accept video needs', () => {
  const banner = index.slice(index.indexOf('<section class="submit-banner">'), index.indexOf('</section>', index.indexOf('<section class="submit-banner">')));
  assert.match(banner, /href="#explore"/);
  assert.doesNotMatch(banner, /href="submit.html"/);
  assert.match(index, /id="dialog-agent-goal"/);
  assert.match(app, /copyAgentPrompt\(item, copy, dialogAgentGoal\?\.value.trim\(\)\)/);
  assert.match(app, /copyText\(buildCreationPrompt\(item, goal\)\)/);
  assert.match(submit, /copyText\(buildPublishingPrompt\(\)\)/);
});
