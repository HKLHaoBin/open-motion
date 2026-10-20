(() => {
  const config = window.OPEN_MOTION_CONFIG || {};
  const agentGoal = document.querySelector('#agent-goal');
  const agentCategory = document.querySelector('#agent-category');
  const copyAgentButton = document.querySelector('#copy-agent-prompt');
  const agentMessage = document.querySelector('#agent-message');
  const promptPreview = document.querySelector('#agent-prompt-preview');
  if (!copyAgentButton) return;

  const setAgentMessage = (text, type = '') => {
    if (!agentMessage) return;
    agentMessage.textContent = text;
    agentMessage.className = `form-message ${type}`.trim();
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('clipboard unavailable');
  };

  const buildPublishingPrompt = () => {
    const goal = agentGoal?.value.trim() || '把这个已有动效项目整理并发布到 Open Motion。';
    const category = agentCategory?.value || '界面演示';
    const targetRepository = config.owner && config.repo
      ? `${config.owner}/${config.repo}`
      : '由 Open Motion 站点配置或项目上下文提供的 Discussions 仓库（不要猜测）';
    const targetCategory = config.category || 'Showcase';

    return `你正在一个已经存在的动效项目根目录中执行任务。请将用户自己已经制作的动效及现有视频上传到 GitHub，并发布到 Open Motion 的 GitHub Discussions。这是已有作品的上传发布任务，不是参考项目制作新视频的任务。请直接基于当前项目完成发布，不要初始化新项目、不要运行脚手架、不要创建第二个空项目，也不要要求我填写项目路径。

【我的发布目标】
${goal}

【Open Motion 发布信息】
平台：Open Motion（GitHub Discussions 驱动的开源动效索引）
作品分类：${category}
目标 Discussions 仓库：${targetRepository}
目标 Discussion 分类：${targetCategory}

【必须自动完成的流程】
1. 检查当前工作目录和 Git 状态，阅读 README、package.json 或其它依赖清单、锁文件、入口文件、时间轴、场景组件、素材目录以及 check/build/preview/render/verify 脚本。不要凭文件名猜测项目内容。
2. 先理解现有作品，定位用户已经制作的视频、动效工程和封面，再运行项目已有的检查、构建或预览命令；需要补充导出视频/封面时，使用现有作品的渲染或截图流程，不重新创作或改写动效。不要重构、替换或破坏现有作品；只补充发布所必需的 README、运行说明和元数据。如果当前仓库没有可发布的作品，停止并说明缺少什么，不根据参考项目生成一个新作品。
3. 检查源码、字体、音乐、图片、视频和其它素材的许可证、署名与转载限制。没有明确授权的素材不要下载、打包或伪装成开源；不要提交 token、密钥、.env、私有文件或签名 URL。
4. 运行 gh auth status，检查 git remote -v，并用 gh repo view 核实现有远程仓库。优先复用适合的公开仓库，不要重复创建仓库。
5. 如果当前项目没有适合的公开远程仓库，使用 gh repo create 创建公开仓库，关联当前项目并推送源码。若已有仓库是私有的、归属不明确或改变可见性会造成风险，先停止并说明原因，不要擅自覆盖或改公开性。
6. 推送后核实仓库 URL、公开状态、源码、README、运行说明和许可证信息都正确。Discussion 目标仓库如果仍无法从站点配置或上下文确认，也要停止并报告，不要猜测目标。
7. 将作品的视频及封面上传到同一个公开作品仓库：小型素材可随源码提交，大型视频优先使用 GitHub Release assets，不把大文件硬塞进 Git 历史。用 gh release create 为已推送的准确提交创建新的作品版本并上传文件，或用 gh release upload 向已确认的作品 Release 补充附件；不要覆盖现有附件或复用无关版本。所有 Release 命令显式指定 --repo 为作品仓库（不是 Open Motion 索引仓库）。使用 gh release view --json assets 核实上传结果，获取匿名可访问的视频和封面 URL，不编造下载链接。
8. 使用 gh api graphql 查询目标仓库的 ID 和 Discussion 分类 ID，然后调用 createDiscussion mutation 发布 Discussion。按名称匹配目标分类，不要猜测 ID 或把作品分类当成 Discussion 分类。正文必须包含：作品标题、作品介绍、“## 分类”下的作品分类、“## GitHub 仓库”下的公开源码仓库 URL、“## 视频”下的实际视频 URL、封面 Markdown 图片、运行方式、技术栈、参考来源（如有）、作者署名、素材授权/权利说明和核验状态。先查询是否已有同一作品的讨论，避免重试导致重复发布；发现已有讨论时报告链接，不擅自覆盖。所有 GraphQL 变量通过 gh 的参数或 JSON 输入传入，不把用户文案拼接成可执行的 shell 命令。
9. 用 gh api graphql 回读 Discussion URL、正文和分类，并核实视频与封面链接可公开访问。只有仓库推送、媒体上传和 Discussion 发布全部成功后才报告发布完成；任何步骤失败都要如实返回已完成的部分和阻塞，不伪造成功。结果包含：你检查了什么、运行了哪些命令、做了哪些必要调整、公开仓库 URL、视频/封面 URL、Discussion URL，以及仍需人工确认的授权或发布警告。

除非遇到 gh auth status 失败、素材权利不清楚、目标仓库无法确认，或操作会破坏现有作品，否则不要停在计划阶段，也不要等待我的二次确认。不要打印或提交任何 token。`;
  };

  const updatePrompt = () => {
    if (promptPreview) promptPreview.textContent = buildPublishingPrompt();
  };

  [agentGoal, agentCategory].forEach((input) => input?.addEventListener('input', updatePrompt));
  copyAgentButton.addEventListener('click', async () => {
    const original = copyAgentButton.dataset.original || copyAgentButton.textContent;
    copyAgentButton.dataset.original = original;
    copyAgentButton.disabled = true;
    copyAgentButton.textContent = '复制中…';
    try {
      await copyText(buildPublishingPrompt());
      setAgentMessage('完整提示词已复制。请在已有动效项目的根目录中粘贴给 Agent。', 'success');
      copyAgentButton.textContent = '已复制 ✓';
      window.setTimeout(() => {
        copyAgentButton.disabled = false;
        copyAgentButton.textContent = original;
      }, 2200);
    } catch {
      copyAgentButton.disabled = false;
      copyAgentButton.textContent = original;
      setAgentMessage('剪贴板不可用。请展开下方提示词后手动复制。', 'error');
    }
  });

  updatePrompt();
})();
