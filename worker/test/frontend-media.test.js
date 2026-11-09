import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../../app.js', import.meta.url), 'utf8');
const section = (start, end) => {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  assert.ok(from >= 0 && to > from, 'production media functions must exist');
  return source.slice(from, to);
};
const playerSource = section('  const BILIBILI_PLAYER_HOST', '  const createBilibiliMedia');
const coverSource = section('  const createMediaCover', '  const createDialogMedia');
const changes = [];
const context = vm.createContext({
  URL, URLSearchParams,
  safeUrl: (url) => url || '',
  createMotionPreview: () => ({ fallback: true }),
  document: {
    createElement: () => {
      const listeners = {};
      return new Proxy({ listeners, addEventListener: (event, fn) => { listeners[event] = fn; } }, {
        set(object, key, value) { changes.push(key); object[key] = value; return true; }
      });
    }
  }
});
vm.runInContext(`${playerSource}\n${coverSource}\nglobalThis.mediaTest = { normalizeBilibiliPlayerUrl, createBilibiliPlayerUrl, createMediaCover };`, context);
const { normalizeBilibiliPlayerUrl, createBilibiliPlayerUrl, createMediaCover } = context.mediaTest;

test('Bilibili embeds explicitly wait for user activation and show the poster', () => {
  const normalized = new URL(normalizeBilibiliPlayerUrl('https://player.bilibili.com/player.html?bvid=BV1cn4E6dE23&cid=43407966750&p=1&autoplay=1'));
  assert.equal(normalized.searchParams.get('autoplay'), '0');
  assert.equal(normalized.searchParams.get('poster'), '1');
  assert.equal(normalized.searchParams.get('bvid'), 'BV1cn4E6dE23');
  assert.equal(normalized.searchParams.get('cid'), '43407966750');
});

test('generated embeds use the same opt-in playback policy', () => {
  const normalized = new URL(createBilibiliPlayerUrl({ bvid: 'BV1cn4E6dE23' }));
  assert.equal(normalized.searchParams.get('autoplay'), '0');
});

test('player normalization still rejects untrusted origins and malformed identities', () => {
  for (const url of [
    'https://example.com/player.html?bvid=BV1cn4E6dE23',
    'http://player.bilibili.com/player.html?bvid=BV1cn4E6dE23',
    'https://player.bilibili.com/player.html?bvid=bad',
    'https://player.bilibili.com/player.html?bvid=BV1cn4E6dE23&cid=invalid'
  ]) assert.equal(normalizeBilibiliPlayerUrl(url), '');
});

test('cover sets no-referrer before assigning src to avoid image hotlink rejection', () => {
  changes.length = 0;
  const image = createMediaCover({ title: 'DrawAI' }, { poster: 'https://i2.hdslb.com/cover.jpg', kind: 'bilibili' });
  assert.equal(image.referrerPolicy, 'no-referrer');
  assert.ok(changes.indexOf('referrerPolicy') < changes.indexOf('src'));
  assert.equal(image.src, 'https://i2.hdslb.com/cover.jpg');
  assert.equal(image.loading, 'lazy');
});

test('missing and failed covers retain the existing safe fallback', () => {
  assert.equal(createMediaCover({ title: 'DrawAI' }, null).fallback, true);
  const image = createMediaCover({ title: 'DrawAI' }, { poster: 'cover.jpg' }, true);
  let replacement;
  image.replaceWith = (value) => { replacement = value; };
  image.listeners.error();
  assert.equal(replacement.fallback, true);
  assert.equal(image.loading, 'eager');
});
