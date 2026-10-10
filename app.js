(() => {
  const config = window.OPEN_MOTION_CONFIG || {};
  const grid = document.querySelector('#discussion-grid');
  const searchInput = document.querySelector('#search-input');
  const sortSelect = document.querySelector('#sort-select');
  const statusText = document.querySelector('#status-text');
  const statusDot = document.querySelector('.status-dot');
  const statusSource = document.querySelector('#status-source');
  const refreshButton = document.querySelector('#feed-refresh');
  const emptyState = document.querySelector('#empty-state');
  const heroCount = document.querySelector('#hero-count');
  const heroSceneTitle = document.querySelector('#hero-scene-title');
  const heroSceneDetail = document.querySelector('#hero-scene-detail');
  const dialog = document.querySelector('#detail-dialog');
  const dialogClose = document.querySelector('#dialog-close');
  const dialogMedia = document.querySelector('#dialog-media');
  const dialogMeta = document.querySelector('#dialog-meta');
  const dialogTitle = document.querySelector('#dialog-title');
  const dialogAuthor = document.querySelector('#dialog-author');
  const dialogSource = document.querySelector('#dialog-source');
  const dialogBody = document.querySelector('#dialog-body');
  const dialogRepositories = document.querySelector('#dialog-repositories');
  const dialogStack = document.querySelector('#dialog-stack');
  const dialogActions = document.querySelector('#dialog-actions');
  const dialogFeedback = document.querySelector('#dialog-feedback');

  if (!grid) return;

  const demoItems = [
    {
      id: 'repo-wise-wong',
      title: 'claude_剪视频过程motion',
      body: '用 React、SVG 和 Remotion 重建一段 30 秒手绘剪辑动画。机器人依次拖入素材、剪辑片段、添加转场和字幕，源码提供 Film.tsx、timeline.ts 和可复现的预览、渲染、验证脚本。',
      author: 'WiseWong6',
      category: '界面演示',
      created_at: '2026-09-24T09:05:00Z',
      comments: 8,
      sourceMedia: { kind: 'image', url: 'https://raw.githubusercontent.com/WiseWong6/claude-video-editing-remotion/main/docs/preview.png' },
      sourceUrl: 'https://github.com/WiseWong6/claude-video-editing-remotion',
      sourcePlatform: 'GitHub repository',
      attribution: 'WiseWong6',
      rights: '代码采用 MIT；字体、音频和原作品权利按仓库 README 说明。',
      verification: '公开仓库可核实，包含 Remotion 源码与可复现命令。',
      repoUrls: ['https://github.com/WiseWong6/claude-video-editing-remotion'],
      directRepoUrl: 'https://github.com/WiseWong6/claude-video-editing-remotion',
      stack: ['Remotion', 'React', 'SVG'],
      scene: 'editor',
      url: ''
    },
    {
      id: 'bili-bv1b9ad6xend',
      title: '震惊瘫坐！Opus 5.5 生成短片《我从未见过太阳》',
      body: '视频标题明确声称短片由 Opus 5.5 生成，简介强调作品的孤独和惊悚感。页面没有公开仓库、协议或评论中的可核实项目地址。',
      author: '霍华德vlog',
      category: '场景叙事',
      created_at: '2026-09-30T03:25:12Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV1b9ad6xEnD.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV1b9ad6xEnD',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：霍华德vlog',
      rights: '页面未见明确参与协议、素材许可或署名要求。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；视频和 Opus 5.5 生成说法可从标题核实。',
      repoUrls: [],
      stack: ['Opus 5.5', 'AI video'],
      scene: 'scene'
    },
    {
      id: 'bili-bv18ta86eehb',
      title: '吓哭了 Opus 5.5 AGI 概念 MV',
      body: '视频简介称这是 mexicat 的 pdoomMV，并公开了一个开源项目链接。页面还记录了 4K、快门 0、采样 auto、拖影强度 0.35 等重新渲染参数。视频明确提到 Opus 5.5，但没有证明动效由 Opus 5.5 生成。',
      author: '白雪仅当雪白',
      category: '场景叙事',
      created_at: '2026-09-27T09:47:56Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV18ta86EEHb.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV18ta86EEHb',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：白雪仅当雪白；项目作者：mexicat',
      rights: '页面未见明确参与协议、素材许可或署名要求，请以原视频和仓库说明为准。',
      verification: '已核对视频简介与当前可见评论；GitHub 仓库地址来自视频简介，Opus 5.5 的具体生成环节仍需继续核验。',
      repoUrls: ['https://github.com/mexicat/pdoom-video'],
      directRepoUrl: 'https://github.com/mexicat/pdoom-video',
      stack: ['Opus 5.5', '代码重渲染'],
      scene: 'scene'
    },
    {
      id: 'bili-bv1vrha63eyg',
      title: 'Opus 5.5 告诉你，它是怎么做视频的',
      body: '简介明确写出 2 分 27 秒、4410 帧，每一帧都是 opus 用代码写出来的，包含分镜、代码、分工卡点、合成和检查。没有公开 GitHub 仓库地址。',
      author: '未来雨季Rainorb',
      category: '界面演示',
      created_at: '2026-10-03T12:05:00Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV1vRHa63EYg.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV1vRHa63EYg',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：未来雨季Rainorb',
      rights: '页面未见明确参与协议、素材许可或署名要求。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；视频简介明确描述代码逐帧制作。',
      stack: ['Opus 5.5', '代码逐帧'],
      scene: 'editor'
    },
    {
      id: 'bili-bv12zhm6oe6m',
      title: '已吓哭 Opus 5.5 真神降临：群论之美宣传片',
      body: '页面标题明确提到 Opus 5.5，页面标注含 AI 生成内容，但没有公开仓库、协议或评论中的可核实项目地址。',
      author: 'sadssxa',
      category: '信息图解',
      created_at: '2026-09-25T15:37:38Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV12Zhm6oE6m.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV12Zhm6oE6m',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：sadssxa',
      rights: '页面未见明确参与协议、素材许可或署名要求。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；生成方式和代码仓库仍待确认。',
      stack: ['Opus 5.5', 'AI video'],
      scene: 'flow'
    },
    {
      id: 'bili-bv186pc65e68',
      title: '用 10 亿 token 画出 Claude 眼中的世界',
      body: '这是 Mili 原曲的非官方同人 MV。简介称 13017 帧、4K、60 帧，使用 Canvas 2D、WebGL 后期、无头浏览器逐帧渲染和 ffmpeg；动画、分镜、踩点和封面由 Claude Code 的 Opus 5.5 通过代码生成。',
      author: '真寻Mahiro',
      category: '背景特效',
      created_at: '2026-10-06T13:37:50Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV186pc65E68.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV186pc65E68',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：真寻Mahiro；音乐：ProjectMili 及相关权利人',
      rights: '原曲、歌词和录音属于原权利人；视频为非盈利个人同人创作，与 Mili、Anthropic、OpenAI 无关联。代码和插图未见具体开源协议。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；简介明确描述 Opus 5.5、Canvas/WebGL、逐帧和 ffmpeg。',
      stack: ['Claude Code', 'Opus 5.5', 'Canvas 2D', 'WebGL', 'ffmpeg'],
      scene: 'orbit'
    },
    {
      id: 'bili-bv1jvaw6jemb',
      title: '盘点 Opus 5.5 做视频达到商业水准的 15 种风格',
      body: '简介称多种视频风格、音乐和音效由 Opus 5.5 编写代码制作，作者后续会分享风格提示词。已核对视频简介与当前可见评论，未发现可核实的 GitHub 仓库 URL；video-shotcraft、talkcraft、anything2explainer 仅以项目名称出现。',
      author: '悬剑听泉',
      category: '场景叙事',
      created_at: '2026-09-29T15:51:54Z',
      comments: 0,
      sourceMedia: {
        kind: 'bilibili',
        url: 'https://www.bilibili.com/video/BV1JvaW6JEMb',
        embedUrl: 'https://player.bilibili.com/player.html?aid=117355116104587&bvid=BV1JvaW6JEMb&cid=42315875822&p=1',
        bvid: 'BV1JvaW6JEMb',
        poster: 'assets/covers/BV1JvaW6JEMb.jpg'
      },
      sourceUrl: 'https://www.bilibili.com/video/BV1JvaW6JEMb',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：悬剑听泉',
      rights: '页面标注未经作者授权禁止转载；收录这里只保存来源链接和署名，不托管视频。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；视频和 Opus 5.5 代码制作说法可从页面核验。',
      stack: ['Opus 5.5', 'Code video'],
      scene: 'type'
    },
    {
      id: 'bili-bv1xcpt6rer8',
      title: 'Opus 5.5 做视频能做到什么程度？一支 4K HDR 宣传片的真实制作记录',
      body: '页面称画面由代码实时渲染，没有使用 AI 视频生成模型；由 Claude Code 制作，主力模型是 Opus 5.5，使用 three.js 程序化渲染 3D 场景、光效、星轨和转场。音乐和音效标注为 CC0。',
      author: '知湫い',
      category: '背景特效',
      created_at: '2026-10-01T16:00:00Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV1Xcpt6REr8.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV1Xcpt6REr8',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：知湫い；音乐与音效作者按视频简介署名',
      rights: '简介标注部分音乐和音效为 CC0，并列出相关作者；视频本身未见完整代码协议。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；简介明确是 Claude Code + Opus 5.5 的代码动效案例。',
      stack: ['Claude Code', 'Opus 5.5', 'three.js', 'CC0 audio'],
      scene: 'orbit'
    },
    {
      id: 'bili-bv1bfpc6resa',
      title: '杀戮尖塔2猎人卡牌特效，Opus 5.5',
      body: '简介称动画基本由 Opus 5.5 完成，音效参考并剪辑游戏原音效，同时使用相关 MOD 和创意工坊创意。没有公开 GitHub 仓库。',
      author: 'CaCATions',
      category: '界面演示',
      created_at: '2026-10-02T10:00:00Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV1bFpc6rESA.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV1bFpc6rESA',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：CaCATions；MOD 作者兰术；创意工坊 Bullet Time: As Depicted 作者 KineticKinkajou',
      rights: '页面未见开源协议或明确转载许可；游戏、MOD、创意工坊和音效权利需分别确认。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；简介明确说动画主要由 Opus 5.5 完成。',
      stack: ['Opus 5.5', 'Game UI motion'],
      scene: 'interface'
    },
    {
      id: 'bili-bv1ethz6genk',
      title: '攒多少钱才能不上班？我和 Opus 5.5 做了一部 46 分钟的关于财务自由和 FIRE 的动画',
      body: '简介称分镜、Blender 脚本逐帧动画、动效引擎、音效设计和混音由 Claude Opus 5.5 完成；音乐列明 CC BY 4.0、CC0 1.0 和 Public Domain Mark 1.0 的来源。',
      author: 'plotome',
      category: '信息图解',
      created_at: '2026-09-29T15:00:00Z',
      comments: 0,
      sourceMedia: { kind: 'image', url: 'assets/covers/BV1eTHZ6gENk.jpg' },
      sourceUrl: 'https://www.bilibili.com/video/BV1eTHZ6gENk',
      sourcePlatform: 'Bilibili',
      attribution: 'UP主：plotome；音乐作者和演奏者按视频简介署名',
      rights: '简介列出 CC BY 4.0、CC0 1.0 和 Public Domain Mark 1.0 音乐来源；CC BY 素材使用时必须保留署名。',
      verification: '已核对视频简介与当前可见评论，未找到可核实 GitHub 仓库；简介列出的 CC BY、CC0 和 Public Domain Mark 音乐来源仍需按原说明署名。',
      stack: ['Opus 5.5', 'Blender', 'Gemini TTS'],
      scene: 'flow'
    }
  ];

  let allItems = [];
  let activeCategory = 'all';
  let activeQuery = '';
  let selectedItem = null;
  let copyResetTimer = null;
  let dialogMediaController = null;
  let dialogCloseTimer = null;
  let dialogCloseAnimationHandler = null;
  let dialogSession = 0;
  let dialogClosing = false;
  let feedRequest = null;
  let feedSequence = 0;
  let feedAuthStatus = { authenticated: false };
  const FEED_CACHE_KEY = 'open-motion-feed-cache-v1';

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '刚刚';
    return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(date);
  };

  const BILIBILI_PLAYER_HOST = 'player.bilibili.com';
  const BILIBILI_PLAYER_PATH = '/player.html';
  const BILIBILI_BVID_PATTERN = /BV[0-9A-Za-z]{10}/i;
  const BILIBILI_BVID_EXACT_PATTERN = /^BV[0-9A-Za-z]{10}$/i;
  const BILIBILI_EMBED_PRESETS = {
    BV1JvaW6JEMb: { aid: '117355116104587', cid: '42315875822', page: '1' }
  };

  const extractBvid = (value = '') => value.match(BILIBILI_BVID_PATTERN)?.[0] || '';

  const extractBilibiliUrl = (body = '') => {
    const match = body.match(/https?:\/\/(?:www\.)?bilibili\.com\/video\/BV[0-9A-Za-z]{10}(?:[^\s)<>]*)?/i);
    return match ? match[0].replace(/[).,]+$/, '') : '';
  };

  const normalizeBilibiliPlayerUrl = (value = '') => {
    try {
      const candidate = value.startsWith('//') ? `https:${value}` : value;
      const url = new URL(candidate);
      if (url.protocol !== 'https:' || url.hostname !== BILIBILI_PLAYER_HOST || url.pathname !== BILIBILI_PLAYER_PATH) return '';
      const rawBvid = url.searchParams.get('bvid') || '';
      const bvid = BILIBILI_BVID_EXACT_PATTERN.test(rawBvid) ? rawBvid : '';
      const aid = url.searchParams.get('aid') || '';
      const cid = url.searchParams.get('cid') || '';
      const page = url.searchParams.get('p') || url.searchParams.get('page') || '1';
      if (!bvid && !/^[1-9]\d{0,19}$/.test(aid)) return '';
      if (bvid && !BILIBILI_BVID_PATTERN.test(bvid)) return '';
      if (cid && !/^[1-9]\d{0,19}$/.test(cid)) return '';
      if (!/^[1-9]\d{0,3}$/.test(page)) return '';
      const params = new URLSearchParams();
      if (aid) params.set('aid', aid);
      if (bvid) params.set('bvid', bvid);
      if (cid) params.set('cid', cid);
      params.set('p', page);
      return `https://${BILIBILI_PLAYER_HOST}${BILIBILI_PLAYER_PATH}?${params.toString()}`;
    } catch {
      return '';
    }
  };

  const createBilibiliPlayerUrl = ({ bvid = '', aid = '', cid = '', page = '1' } = {}) => {
    const params = new URLSearchParams();
    if (aid) params.set('aid', aid);
    if (bvid) params.set('bvid', bvid);
    if (cid) params.set('cid', cid);
    params.set('p', page);
    return normalizeBilibiliPlayerUrl(`https://${BILIBILI_PLAYER_HOST}${BILIBILI_PLAYER_PATH}?${params.toString()}`);
  };

  const createBilibiliMedia = (sourceUrl, body = '', explicitEmbedUrl = '') => {
    if (!sourceUrl && !explicitEmbedUrl) return null;
    const bvid = extractBvid(sourceUrl || explicitEmbedUrl);
    const preset = BILIBILI_EMBED_PRESETS[bvid] || {};
    const embedUrl = normalizeBilibiliPlayerUrl(explicitEmbedUrl)
      || (bvid ? createBilibiliPlayerUrl({ bvid, ...preset }) : '');
    if (!embedUrl) return null;
    return {
      kind: 'bilibili',
      url: sourceUrl || embedUrl,
      embedUrl,
      bvid,
      poster: bvid ? `assets/covers/${bvid}.jpg` : ''
    };
  };

  const stripMarkdown = (value = '') => value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const IMAGE_EXTENSION_PATTERN = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
  const cleanImageCandidate = (value = '') => value
    .trim()
    .replace(/^<|>$/g, '')
    .replace(/[),.;!?]+$/g, '');

  const extractFirstImageUrl = (body = '') => {
    const candidates = [];
    const addCandidate = (value, index, likelyImage = true) => {
      const candidate = cleanImageCandidate(value);
      if (!candidate || !likelyImage) return;
      candidates.push({ candidate, index });
    };

    const markdownPattern = /!\[[^\]]*\]\(\s*(?:<)?([^\s)>]+)(?:>)?[^)]*\)/gi;
    let match;
    while ((match = markdownPattern.exec(body))) addCandidate(match[1], match.index);

    const htmlPattern = /<img\b[^>]*?\bsrc\s*=\s*(["'])(.*?)\1/gi;
    while ((match = htmlPattern.exec(body))) addCandidate(match[2], match.index);

    const unquotedHtmlPattern = /<img\b[^>]*?\bsrc\s*=\s*([^\s>]+)/gi;
    while ((match = unquotedHtmlPattern.exec(body))) addCandidate(match[1], match.index);

    const plainPattern = /(?:https?:\/\/|\/\/|(?:^|[\s(])(?:\.\.?\/|\/))[^\s<>"')]+/gi;
    while ((match = plainPattern.exec(body))) {
      const value = match[0].trim();
      const candidate = value.startsWith('http') || value.startsWith('//')
        ? value
        : value.replace(/^[\s(]+/, '');
      addCandidate(candidate, match.index, IMAGE_EXTENSION_PATTERN.test(candidate));
    }

    candidates.sort((a, b) => a.index - b.index);
    for (const { candidate } of candidates) {
      const normalized = candidate.startsWith('//') ? `https:${candidate}` : candidate;
      const safe = safeUrl(normalized);
      if (safe) return safe;
    }
    return '';
  };

  const extractMedia = (body = '', index = 0) => {
    const playerSource = body.match(/(?:https?:)?\/\/player\.bilibili\.com\/player\.html\?[^\s"'<>]+/i)?.[0] || '';
    const sourceUrl = extractBilibiliUrl(body);
    const bilibili = createBilibiliMedia(sourceUrl, body, playerSource);
    if (bilibili) return bilibili;
    const imageUrl = extractFirstImageUrl(body);
    if (imageUrl) return { kind: 'image', url: imageUrl };
    const directMedia = body.match(/https?:\/\/[^\s)]+\.(?:mp4|webm|mov)(?:\?[^\s)]*)?/i);
    if (directMedia) return { kind: 'video', url: directMedia[0] };
    return null;
  };

  const extractRepos = (body = '') => {
    const matches = body.match(/https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/gi) || [];
    return [...new Set(matches.map((url) => url.replace(/[).,]+$/, '').replace(/\/$/, '')))];
  };

  const extractDirectRepo = (body = '') => {
    const section = body.match(/(?:^|\n)#{1,6}\s*(?:GitHub\s+仓库|GitHub\s+Repository|源码仓库)\s*\n([\s\S]*?)(?=\n#{1,6}\s|$)/i)?.[1] || '';
    return extractRepos(section)[0] || '';
  };

  const WORK_CATEGORIES = new Set(['文字排版', '信息图解', '界面演示', '场景叙事', '背景特效']);

  const extractWorkCategory = (body = '') => {
    const sectionValue = body.match(/(?:^|\n)#{1,6}\s*(?:作品)?分类\s*\n([^\n]+)/i)?.[1]?.trim() || '';
    const inlineValue = body.match(/(?:作品)?分类\s*[:：]\s*([^\n]+)/i)?.[1]?.trim() || '';
    const value = sectionValue || inlineValue;
    return WORK_CATEGORIES.has(value) ? value : '';
  };

  const extractStack = (body = '') => {
    const known = [
      ['Remotion', /\bremotion\b/i],
      ['React', /\breact\b/i],
      ['SVG', /\bsvg\b/i],
      ['Canvas', /\bcanvas\b/i],
      ['WebGL', /\bwebgl\b/i],
      ['three.js', /three\.js/i],
      ['Blender', /\bblender\b/i],
      ['GSAP', /\bgsap\b/i],
      ['Motion', /\bmotion(?:\/react)?\b/i],
      ['CSS', /\bcss\b/i],
      ['ffmpeg', /\bffmpeg\b/i]
    ];
    return known.filter(([, pattern]) => pattern.test(body)).map(([name]) => name).slice(0, 6);
  };

  const extractSourceUrl = (body = '') => {
    const source = body.match(/https?:\/\/(?:www\.)?bilibili\.com\/video\/[^\s)]+/i);
    return source ? source[0].replace(/[).,]+$/, '') : '';
  };

  const inferScene = (category, body = '') => {
    if (/remotion|剪辑|timeline|视频/i.test(body)) return 'editor';
    if (category === '文字排版') return 'type';
    if (category === '界面演示') return 'interface';
    if (category === '信息图解') return 'flow';
    if (category === '场景叙事') return 'scene';
    return 'orbit';
  };

  const normalizeDiscussion = (item, index) => {
    const body = item.body || item.bodyText || '';
    const plainBody = stripMarkdown(body);
    const repos = extractRepos(body);
    const directRepoUrl = extractDirectRepo(body) || repos[0] || '';
    const sourceMedia = extractMedia(body, index);
    const sourceUrl = extractSourceUrl(body)
      || (sourceMedia?.kind === 'bilibili' ? sourceMedia.url || '' : '');
    const coverUrl = extractFirstImageUrl(body);
    const discussionCategory = item.category?.name || item.category || '未分类';
    const category = extractWorkCategory(body) || discussionCategory;
    return {
      id: String(item.number || item.id || `discussion-${index}`),
      title: item.title || '未命名讨论',
      body: plainBody,
      author: item.user?.login || item.author?.login || 'github contributor',
      category,
      discussionCategory,
      created_at: item.created_at || item.createdAt || new Date().toISOString(),
      comments: Number(item.comments || 0),
      sourceMedia,
      coverUrl,
      sourceUrl,
      sourcePlatform: sourceMedia?.kind === 'bilibili' || sourceUrl.includes('bilibili.com') ? 'Bilibili' : sourceUrl ? 'External source' : '',
      attribution: item.user?.login ? `Discussion 作者：${item.user.login}` : '',
      rights: /许可|license|授权|署名/i.test(plainBody) ? '授权信息请以 Discussion 正文和仓库 LICENSE 为准。' : '未在 Discussion 正文中找到明确授权说明。',
      verification: repos.length ? '已解析到公开 GitHub 仓库地址，请继续核对 README 和 LICENSE。' : '尚未解析到公开仓库，生成方式和授权状态需要继续核验。',
      repoUrls: repos,
      directRepoUrl,
      stack: extractStack(body),
      scene: inferScene(category, body),
      url: item.html_url || item.url || '',
      labels: Array.isArray(item.labels) ? item.labels.map((label) => label.name || label) : []
    };
  };

  const setStatus = (message, mode = 'ready', source = '') => {
    statusText.textContent = message;
    statusDot.classList.toggle('error', mode === 'error');
    statusDot.classList.toggle('loading', mode === 'loading');
    statusDot.classList.toggle('cached', mode === 'cached');
    statusSource.textContent = source ? ` · ${source}` : '';
    statusSource.dataset.source = source;
  };

  const safeUrl = (value = '') => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, window.location.href);
      if (url.origin === window.location.origin) return url.toString();
      return url.protocol === 'https:' ? url.toString() : '';
    } catch {
      return '';
    }
  };

  const rightsState = (item) => {
    const text = `${item.rights || ''} ${item.verification || ''}`;
    if (/待确认|未见|未公开|未核实|需分别|禁止转载|没有公开|未获官方/i.test(text)) return '待核验';
    if (/MIT|CC0|CC BY|Public Domain|许可已|授权信息/i.test(text)) return '许可已注明';
    return '来源已记录';
  };

  const createMotionPreview = (item, large = false) => {
    const preview = document.createElement('div');
    preview.className = `motion-preview motion-preview-${item.scene || 'orbit'}${large ? ' is-large' : ''}`;
    preview.setAttribute('aria-label', `${item.title} 动态预览`);
    preview.innerHTML = '<span class="preview-grid"></span><span class="preview-orb"></span><span class="preview-line"></span><span class="preview-word">MOTION</span>';
    return preview;
  };

  const resolveItemMedia = (item, forDialog = false) => {
    const stored = item.sourceMedia || null;
    const explicitPoster = safeUrl(stored?.poster);
    const discussionCover = safeUrl(item.coverUrl);
    const storedImage = stored?.kind === 'image' ? safeUrl(stored.url) : '';
    let media = stored;

    if (forDialog && item.sourcePlatform === 'Bilibili' && item.sourceUrl) {
      const bilibili = createBilibiliMedia(item.sourceUrl, '', stored?.embedUrl || '');
      if (bilibili) media = { ...bilibili };
    }

    if (!media) return null;
    return {
      ...media,
      poster: explicitPoster || discussionCover || storedImage || safeUrl(media.poster)
    };
  };

  const createMediaCover = (item, media, large = false) => {
    const poster = safeUrl(media?.poster) || (media?.kind === 'image' ? safeUrl(media.url) : '');
    if (!poster) return createMotionPreview(item, large);
    const image = document.createElement('img');
    image.loading = large ? 'eager' : 'lazy';
    image.src = poster;
    image.alt = `${item.title} 参考封面`;
    image.addEventListener('error', () => {
      image.replaceWith(createMotionPreview(item, large));
    }, { once: true });
    return image;
  };

  const createDialogMedia = (item) => {
    const media = resolveItemMedia(item, true);
    const stage = document.createElement('div');
    stage.className = 'dialog-media-stage';
    stage.setAttribute('role', 'group');
    stage.setAttribute('aria-label', `${item.title} 媒体预览`);
    const session = ++dialogSession;
    let destroyed = false;
    let iframe = null;
    let cover = null;
    let status = null;

    const isCurrent = () => !destroyed && session === dialogSession;
    const showStatus = (message) => {
      if (!isCurrent()) return;
      status ||= document.createElement('span');
      status.className = 'dialog-media-status';
      status.textContent = message;
      stage.append(status);
      stage.classList.add('is-error');
    };
    const makeReady = () => {
      if (!isCurrent()) return;
      iframe?.removeAttribute('aria-hidden');
      iframe?.removeAttribute('tabindex');
      stage.classList.add('is-loaded');
      dialogMedia.removeAttribute('aria-busy');
    };

    if (!media) {
      stage.append(createMotionPreview(item, true));
      return {
        element: stage,
        destroy: () => { destroyed = true; }
      };
    }

    if (media.kind !== 'bilibili') {
      stage.append(createMediaElement(item, 0, true));
      return {
        element: stage,
        destroy: () => {
          destroyed = true;
          const video = stage.querySelector('video');
          if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
          }
        }
      };
    }

    cover = createMediaCover(item, media, true);
    stage.append(cover);
    dialogMedia.setAttribute('aria-busy', 'true');

    const waitForCover = new Promise((resolve) => {
      if (cover.tagName !== 'IMG') {
        resolve();
        return;
      }
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      cover.addEventListener('load', finish, { once: true });
      cover.addEventListener('error', () => {
        if (isCurrent()) {
          const preview = createMotionPreview(item, true);
          cover.replaceWith(preview);
          cover = preview;
        }
        finish();
      }, { once: true });
      if (cover.complete) window.queueMicrotask(() => {
        if (cover.naturalWidth > 0) finish();
        else cover.dispatchEvent(new Event('error'));
      });
    });

    waitForCover.then(() => {
      if (!isCurrent()) return;
      const embedUrl = normalizeBilibiliPlayerUrl(media.embedUrl);
      if (!embedUrl) {
        showStatus('播放器来源无法核验，已保留封面。');
        dialogMedia.removeAttribute('aria-busy');
        return;
      }
      iframe = document.createElement('iframe');
      iframe.className = 'dialog-player';
      iframe.title = `${item.title} Bilibili 视频`;
      iframe.loading = 'eager';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
      iframe.setAttribute('aria-label', `${item.title} Bilibili 视频播放器`);
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      iframe.addEventListener('load', makeReady, { once: true });
      iframe.addEventListener('error', () => {
        if (!isCurrent()) return;
        iframe.remove();
        iframe = null;
        showStatus('视频播放器加载失败，已保留封面。');
        dialogMedia.removeAttribute('aria-busy');
      }, { once: true });
      stage.append(iframe);
      iframe.src = embedUrl;
    });

    return {
      element: stage,
      destroy: () => {
        if (destroyed) return;
        destroyed = true;
        if (iframe) {
          iframe.src = 'about:blank';
          iframe.remove();
          iframe = null;
        }
        const video = stage.querySelector('video');
        if (video) {
          video.pause();
          video.removeAttribute('src');
          video.load();
        }
      }
    };
  };

  const createMediaElement = (item, index, large = false) => {
    const media = resolveItemMedia(item, false);
    if (media?.kind === 'bilibili') return createMediaCover(item, media, large);
    if (media?.kind === 'video' && safeUrl(media.url)) {
      const video = document.createElement('video');
      video.src = media.url;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = large ? 'metadata' : 'none';
      video.controls = large;
      if (media.poster) video.poster = media.poster;
      video.setAttribute('aria-label', `${item.title} 视频参考`);
      if (!large) video.addEventListener('pointerenter', () => video.play().catch(() => {}), { once: true });
      return video;
    }
    if (media?.kind === 'image' && safeUrl(media.url)) {
      const image = document.createElement('img');
      image.loading = large ? 'eager' : 'lazy';
      image.src = safeUrl(item.coverUrl) || safeUrl(media.url);
      image.alt = `${item.title} 参考画面`;
      image.addEventListener('error', () => { image.replaceWith(createMotionPreview(item, large)); }, { once: true });
      return image;
    }
    return createMotionPreview(item, large);
  };

  const buildAgentPrompt = (item, goal = '') => {
    const repositories = item.repoUrls?.length ? item.repoUrls.join('\n') : '（当前条目没有解析到仓库地址，请从 Discussion 正文和 README 中继续确认）';
    const directRepository = item.directRepoUrl || '（尚未确认直接来源仓库）';
    const discussion = item.url || '（发布后回填 Discussion URL）';
    const source = item.sourceUrl || '（当前条目没有直接来源链接）';
    const media = item.sourceMedia?.url || '（当前条目没有直接媒体地址）';
    const targetRepository = config.owner && config.repo
      ? `${config.owner}/${config.repo}`
      : '由 Open Motion 站点配置或项目上下文提供的 Discussions 仓库（不要猜测）';
    return `你正在一个已经存在的动效项目根目录中执行任务。请基于当前项目和下面的参考条目完成发布，不要初始化新项目、不要运行脚手架、不要创建第二个空项目，也不要要求我填写项目路径。

【参考条目】
标题：${item.title}
分类：${item.category}
GitHub Discussion 分类：${item.discussionCategory || item.category}
介绍：${item.body || '暂无介绍'}
原始讨论：${discussion}
来源视频/页面：${source}
来源平台：${item.sourcePlatform || 'GitHub Discussion'}
作者与署名：${item.attribution || `@${item.author}`}
参考媒体：${media}
技术栈：${item.stack?.join(', ') || '请先从仓库识别'}
授权与权利提示：${item.rights || '请先核对原作者说明、README 和 LICENSE'}
核验状态：${item.verification || '需要继续核验'}
直接来源仓库：${directRepository}
参考/复刻仓库：
${repositories}

【我的改造目标】
${goal || '先理解当前项目和参考动效，只在现有项目中完成必要的发布整理，不擅自重构作品。'}

【Open Motion 发布信息】
目标 Discussions 仓库：${targetRepository}
目标 Discussion 分类：${config.category || 'Showcase'}

【必须自动完成的流程】
1. 检查当前工作目录和 Git 状态，阅读现有项目的 README、package.json、锁文件、入口文件、时间轴、场景组件、素材目录以及 preview/build/render/check/verify 脚本。先运行预览或检查确认真实结构，不要只凭截图猜测。
2. 保留当前项目的作品内容和实现。只替换我明确要求的文案、素材、颜色或主题；如果没有明确改造要求，不要重构、替换或破坏现有动效。
3. 检查所有素材授权、署名和转载限制。不要下载或提交无权使用的原始视频、私密音频、签名 URL、token、.env 或其他密钥；不要把参考仓库的代码许可证当成第三方素材许可证。
4. 运行项目已有的 check/build/verify 和必要的 preview/render 命令，并补充发布所需的 README、运行方式、技术栈和许可证说明。
5. 运行 gh auth status 和 git remote -v。优先复用适合的公开 GitHub 仓库；只有当前项目没有合适的公开远程仓库时，才用 gh repo create 创建公开仓库、关联 remote 并推送源码。私有仓库、归属不明或可能覆盖现有工作的情况必须暂停并报告。
6. 推送后用 gh repo view 核实公开状态、源码、README、运行命令和许可证信息。目标 Discussions 仓库如果无法从站点配置或项目上下文确认，也必须暂停，不要猜测。
7. 使用 gh api graphql 查询目标仓库 ID 和 Discussion 分类 ID，调用 createDiscussion mutation 发布 Discussion。正文必须包含作品标题、介绍、分类、参考 Discussion、公开仓库地址、运行方式、技术栈、作者署名、素材授权说明和核验状态。
8. 只有仓库推送和 Discussion 成功后才返回：检查内容、运行命令、必要调整、公开仓库 URL、Discussion URL，以及剩余警告。

除非 gh auth status 失败、素材权利不清楚、目标仓库无法确认，或操作会破坏现有项目，否则不要停在计划阶段，也不要等待二次确认。不要打印或提交任何 token。`;
  };

  const copyText = async (value) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    if (!copied) throw new Error('clipboard unavailable');
  };

  const copyAgentPrompt = async (item, trigger) => {
    const original = trigger.dataset.original || trigger.textContent;
    trigger.dataset.original = original;
    trigger.disabled = true;
    trigger.textContent = '复制中…';
    try {
      await copyText(buildAgentPrompt(item));
      trigger.textContent = '已复制给 Agent ✓';
      if (dialogFeedback) dialogFeedback.textContent = '已复制完整上下文，可直接粘贴到 Agent。';
      clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        trigger.disabled = false;
        trigger.textContent = original;
      }, 2600);
    } catch {
      trigger.disabled = false;
      trigger.textContent = original;
      if (dialogFeedback) dialogFeedback.textContent = '剪贴板不可用，请使用浏览器允许复制，或打开仓库手动提供上下文。';
    }
  };

  const renderCard = (item, index) => {
    const article = document.createElement('article');
    article.className = 'discussion-card';
    article.dataset.id = item.id;
    const cover = document.createElement('div');
    cover.className = 'card-cover';
    cover.style.setProperty('--ratio', index % 3 === 0 ? '1.3' : index % 2 === 0 ? '0.92' : '1.08');
    const media = createMediaElement(item, index);
    media.classList.add('card-media');
    cover.append(media);
    const indexLabel = document.createElement('span');
    indexLabel.className = 'card-index';
    indexLabel.textContent = String(index + 1).padStart(2, '0');
    const play = document.createElement('span');
    play.className = 'card-play';
    play.setAttribute('aria-hidden', 'true');
    play.textContent = item.sourcePlatform === 'Bilibili' || item.sourceMedia?.kind === 'bilibili' || item.sourceMedia?.kind === 'video' ? '▶' : '↗';
    cover.append(indexLabel, play);

    const content = document.createElement('div');
    content.className = 'card-content';
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = item.title;
    const excerpt = document.createElement('p');
    excerpt.className = 'card-excerpt';
    excerpt.textContent = item.body || '这个讨论还没有添加介绍。';
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    const author = document.createElement('span');
    author.className = 'card-author';
    author.textContent = `@${item.author} · ${formatDate(item.created_at)}`;
    const category = document.createElement('span');
    category.className = 'card-category';
    category.textContent = item.category;
    meta.append(author, category);
    content.append(title, excerpt, meta);

    const resourceRow = document.createElement('div');
    resourceRow.className = 'card-resource-row';
    const directRepoUrl = item.directRepoUrl || '';
    const repoHref = directRepoUrl || item.repoUrls?.[0] || '';
    if (repoHref) {
      const repo = document.createElement('a');
      repo.className = 'card-repo';
      repo.href = safeUrl(repoHref) || '#';
      repo.target = '_blank';
      repo.rel = 'noreferrer';
      repo.textContent = directRepoUrl
        ? `源码仓库${item.repoUrls?.length > 1 ? ` + ${item.repoUrls.length - 1} 个参考仓库` : ''} ↗`
        : `⌘ ${item.repoUrls.length} 个仓库 ↗`;
      repo.addEventListener('click', (event) => event.stopPropagation());
      resourceRow.append(repo);
    } else {
      const type = document.createElement('span');
      type.className = 'card-repo muted';
      type.textContent = item.sourceUrl ? '仓库未公开' : '动态预览';
      resourceRow.append(type);
    }
    if (item.sourceUrl) {
      const source = document.createElement('a');
      source.className = 'card-source';
      source.href = safeUrl(item.sourceUrl) || '#';
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      source.textContent = `${item.sourcePlatform || '来源'} ↗`;
      source.addEventListener('click', (event) => event.stopPropagation());
      resourceRow.append(source);
    }
    const rights = document.createElement('span');
    rights.className = `card-rights ${rightsState(item) === '待核验' ? 'is-pending' : ''}`;
    rights.textContent = rightsState(item);
    resourceRow.append(rights);
    const agent = document.createElement('button');
    agent.className = 'card-agent';
    agent.type = 'button';
    agent.textContent = '给 Agent';
    agent.addEventListener('click', (event) => {
      event.stopPropagation();
      copyAgentPrompt(item, agent);
    });
    resourceRow.append(agent);
    content.append(resourceRow);
    article.append(cover, content);
    article.addEventListener('click', () => openDetail(item));
    return article;
  };

  const filteredItems = () => {
    const query = activeQuery.trim().toLowerCase();
    return allItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const haystack = `${item.title} ${item.body} ${item.author} ${item.category} ${(item.stack || []).join(' ')} ${(item.repoUrls || []).join(' ')}`.toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    }).sort((a, b) => {
      if (sortSelect.value === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortSelect.value === 'comments') return b.comments - a.comments;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const render = () => {
    const items = filteredItems();
    grid.replaceChildren(...items.map(renderCard));
    emptyState.hidden = items.length !== 0;
    heroCount.textContent = `${items.length} ${items.length === 1 ? 'REFERENCE' : 'REFERENCES'}`;
  };

  const renderRepositories = (item) => {
    dialogRepositories.replaceChildren();
    if (!item.repoUrls?.length) return;
    const heading = document.createElement('h3');
    heading.textContent = `${item.repoUrls.length} 个来源仓库`;
    dialogRepositories.append(heading);
    item.repoUrls.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = safeUrl(url) || '#';
      link.target = '_blank';
      link.rel = 'noreferrer';
      const kind = url === item.directRepoUrl ? '直接来源' : index === 0 ? '参考实现' : '社区复刻';
      link.textContent = `${kind} · ${url.replace('https://github.com/', '')} ↗`;
      dialogRepositories.append(link);
    });
  };

  const clearDialogMedia = () => {
    dialogSession += 1;
    dialogMediaController?.destroy();
    dialogMediaController = null;
    dialogMedia.replaceChildren();
    dialogMedia.removeAttribute('aria-busy');
  };

  const finishDialogClose = () => {
    if (dialogCloseTimer) {
      window.clearTimeout(dialogCloseTimer);
      dialogCloseTimer = null;
    }
    dialog.removeEventListener('animationend', dialogCloseAnimationHandler);
    dialogCloseAnimationHandler = null;
    dialog.classList.remove('is-closing');
    if (dialog.open) dialog.close();
    else dialogClosing = false;
  };

  const requestDialogClose = () => {
    if (!dialog.open || dialogClosing) return;
    dialogClosing = true;
    dialogMediaController?.destroy();
    dialogMediaController = null;
    dialogSession += 1;
    dialogMedia.removeAttribute('aria-busy');
    dialog.classList.add('is-closing');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishDialogClose();
      return;
    }
    dialogCloseAnimationHandler = (event) => {
      if (event.animationName === 'dialog-out') finishDialogClose();
    };
    dialog.addEventListener('animationend', dialogCloseAnimationHandler);
    dialogCloseTimer = window.setTimeout(finishDialogClose, 280);
  };

  const openDetail = (item) => {
    if (dialogClosing) finishDialogClose();
    clearDialogMedia();
    selectedItem = item;
    dialog.classList.remove('is-closing');
    const categoryMeta = item.discussionCategory && item.discussionCategory !== item.category
      ? `${item.category} / ${item.discussionCategory}`
      : item.category;
    dialogMeta.textContent = `${categoryMeta} / ${formatDate(item.created_at)} / ${item.comments} 条评论`;
    dialogTitle.textContent = item.title;
    dialogAuthor.textContent = `由 @${item.author} 发布`;
    dialogSource.replaceChildren();
    const sourceLine = document.createElement('p');
    sourceLine.className = 'source-line';
    sourceLine.textContent = `${item.sourcePlatform || '来源'} · ${item.attribution || `@${item.author}`}`;
    dialogSource.append(sourceLine);
    if (item.sourceUrl) dialogSource.append(makeAction('打开来源 ↗', item.sourceUrl, true, 'source-link'));
    if (item.directRepoUrl) dialogSource.append(makeAction('打开直接来源仓库 ↗', item.directRepoUrl, true, 'source-link'));
    const rightsLine = document.createElement('p');
    rightsLine.className = `rights-line ${rightsState(item) === '待核验' ? 'is-pending' : ''}`;
    rightsLine.textContent = `${rightsState(item)} · ${item.rights || '未提供授权说明。'}`;
    dialogSource.append(rightsLine);
    const verificationLine = document.createElement('p');
    verificationLine.className = 'verification-line';
    verificationLine.textContent = `核验：${item.verification || '需要继续核验。'}`;
    dialogSource.append(verificationLine);
    dialogBody.textContent = item.body || '这个讨论还没有添加介绍。';
    dialogMedia.replaceChildren();
    dialogMediaController = createDialogMedia(item);
    dialogMedia.append(dialogMediaController.element);
    renderRepositories(item);
    dialogStack.replaceChildren();
    if (item.stack?.length) {
      const stackLabel = document.createElement('span');
      stackLabel.textContent = '技术栈';
      dialogStack.append(stackLabel, ...item.stack.map((name) => {
        const tag = document.createElement('b');
        tag.textContent = name;
        return tag;
      }));
    }
    dialogActions.replaceChildren();
    const copy = document.createElement('button');
    copy.className = 'button button-primary';
    copy.type = 'button';
    copy.textContent = '复制给 Agent ⌘';
    copy.addEventListener('click', () => copyAgentPrompt(item, copy));
    dialogActions.append(copy);
    if (item.url) dialogActions.append(makeAction('打开原始讨论 ↗', item.url, true, 'button-quiet'));
    if (item.repoUrls?.[0]) dialogActions.append(makeAction(item.directRepoUrl ? '打开直接来源仓库 ↗' : '打开参考仓库 ↗', item.directRepoUrl || item.repoUrls[0], true, 'button-quiet'));
    dialogFeedback.textContent = '';
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    else dialog.setAttribute('open', '');
  };

  const makeAction = (label, href, external = false, extraClass = '') => {
    const link = document.createElement('a');
    link.className = `button ${extraClass || 'button-primary'}`;
    link.href = safeUrl(href) || '#';
    link.textContent = label;
    if (external) { link.target = '_blank'; link.rel = 'noreferrer'; }
    return link;
  };

  const mergeItems = (liveItems) => {
    const liveKeys = new Set(liveItems.flatMap((item) => [item.url, item.title]).filter(Boolean));
    return [...liveItems, ...demoItems.filter((item) => !liveKeys.has(item.url) && !liveKeys.has(item.title))];
  };

  const readBrowserFeed = () => {
    try {
      const value = JSON.parse(window.localStorage.getItem(FEED_CACHE_KEY) || 'null');
      if (!value || value.version !== 1 || !Array.isArray(value.items) || !value.fetchedAt) return null;
      return value;
    } catch {
      return null;
    }
  };

  const writeBrowserFeed = (items, fetchedAt) => {
    try {
      window.localStorage.setItem(FEED_CACHE_KEY, JSON.stringify({ version: 1, items, fetchedAt }));
    } catch {
      // Private browsing and storage quotas must not block feed rendering.
    }
  };

  const sourceLabel = (source, stale) => {
    if (source === 'live') return '最新同步';
    if (source === 'cache' && stale) return '缓存已过期';
    if (source === 'cache') return '服务器缓存';
    if (source === 'browser-cache') return '浏览器缓存';
    return '精选回退';
  };

  const applyFeedPayload = (payload, fallbackSource = 'cache') => {
    const rawItems = Array.isArray(payload?.items) ? payload.items : [];
    const normalized = rawItems.map((item) => normalizeDiscussion(item)).filter((item) => item.title || item.body || item.url);
    allItems = mergeItems(normalized);
    const meta = payload?.meta || {};
    const source = meta.source || fallbackSource;
    const stale = Boolean(meta.stale);
    if (rawItems.length) writeBrowserFeed(rawItems, meta.fetchedAt || new Date().toISOString());
    const anonymousNote = feedAuthStatus.authenticated
      ? '已登录：可同步最新 Discussions。'
      : '当前显示缓存内容；GitHub 匿名 API 受到访问频率限制，登录后刷新可获取最新内容。';
    const warning = meta.warning && meta.warning !== 'session_invalid' ? `（${meta.warning === 'rate_limited' ? '请求受限' : '同步暂不可用'}）` : '';
    setStatus(`${anonymousNote} ${normalized.length} 条公开参考${warning}`, stale || source !== 'live' ? 'cached' : 'ready', sourceLabel(source, stale));
    render();
  };

  const renderDemoFallback = (reason = '') => {
    allItems = demoItems;
    const suffix = reason === 'worker-unavailable' ? 'Worker 暂不可用，已显示精选参考内容。' : '未找到可用缓存，已显示精选参考内容。';
    setStatus(`${feedAuthStatus.authenticated ? '已登录：同步暂不可用。' : '当前显示缓存内容；GitHub 匿名 API 受到访问频率限制，登录后刷新可获取最新内容。'} ${suffix}`, 'error', '精选回退');
    render();
  };

  const loadDiscussions = async ({ latest = false } = {}) => {
    if (feedRequest) return feedRequest;
    const requestId = ++feedSequence;
    feedRequest = (async () => {
      const auth = window.OpenMotionAuth;
      if (auth?.getStatus) feedAuthStatus = await auth.getStatus({ silent: true });
      if (!config.owner || !config.repo || !auth?.apiFetch) {
        renderDemoFallback('worker-unavailable');
        return;
      }
      if (latest && !feedAuthStatus.authenticated) {
        const cached = readBrowserFeed();
        if (cached) applyFeedPayload({ items: cached.items, meta: { source: 'browser-cache', fetchedAt: cached.fetchedAt, stale: true } }, 'browser-cache');
        else renderDemoFallback();
        return;
      }
      if (!latest) setStatus(feedAuthStatus.authenticated ? '正在读取服务器缓存…' : '正在读取服务器缓存；匿名 API 受到访问频率限制。', 'loading', '同步中');
      else setStatus('正在向 GitHub 请求最新 Discussions…', 'loading', '同步中');
      try {
        const payload = await auth.apiFetch(latest ? '/api/feed/latest' : '/api/feed', latest ? { method: 'POST', body: {} } : {});
        if (requestId !== feedSequence) return;
        applyFeedPayload(payload);
      } catch (error) {
        if (requestId !== feedSequence) return;
        if (error?.status === 401 && auth?.getStatus) feedAuthStatus = await auth.getStatus({ silent: true });
        const cached = readBrowserFeed();
        if (cached) {
          applyFeedPayload({ items: cached.items, meta: { source: 'browser-cache', fetchedAt: cached.fetchedAt, stale: true, warning: error?.code || 'worker_unavailable' } }, 'browser-cache');
        } else {
          renderDemoFallback(error?.code || 'worker-unavailable');
        }
        console.warn('Open Motion feed request failed:', error?.code || 'worker_unavailable', error?.status || '');
      }
    })().finally(() => { feedRequest = null; });
    return feedRequest;
  };

  window.addEventListener('open-motion-auth-change', (event) => {
    feedAuthStatus = event.detail?.status || feedAuthStatus;
    if (refreshButton) refreshButton.disabled = !feedAuthStatus.authenticated;
    if (event.detail?.status) loadDiscussions();
  });
  refreshButton?.addEventListener('click', () => loadDiscussions({ latest: true }));

  document.querySelectorAll('.filter').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.dataset.category;
      render();
    });
  });
  searchInput.addEventListener('input', () => { activeQuery = searchInput.value; render(); });
  sortSelect.addEventListener('change', render);
  dialogClose.addEventListener('click', requestDialogClose);
  dialog.addEventListener('click', (event) => { if (event.target === dialog) requestDialogClose(); });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    requestDialogClose();
  });
  dialog.addEventListener('beforetoggle', (event) => {
    if (event.newState !== 'closed' || dialogClosing) return;
    dialogSession += 1;
    dialogMediaController?.destroy();
    dialogMediaController = null;
    dialogMedia.removeAttribute('aria-busy');
  });
  dialog.addEventListener('close', () => {
    if (dialogCloseTimer) {
      window.clearTimeout(dialogCloseTimer);
      dialogCloseTimer = null;
    }
    dialog.removeEventListener('animationend', dialogCloseAnimationHandler);
    dialogCloseAnimationHandler = null;
    dialog.classList.remove('is-closing');
    dialogClosing = false;
    clearDialogMedia();
    selectedItem = null;
  });
  window.addEventListener('pagehide', clearDialogMedia);

  const canvas = document.querySelector('#hero-canvas');
  const context = canvas?.getContext('2d');
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduceMotion = reduceQuery.matches;
  if (context) {
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const ease = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };
    const progress = (time, start, end) => ease((time - start) / (end - start));
    const lerp = (from, to, amount) => from + (to - from) * amount;
    const seed = (index) => {
      const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
      return value - Math.floor(value);
    };
    const duration = 16;
    const heroAssets = [
      { src: 'assets/covers/BV1vRHa63EYg.jpg', label: '代码制作记录', file: 'timeline.ts' },
      { src: 'assets/covers/BV1JvaW6JEMb.jpg', label: '多种动效风格', file: 'Film.tsx' },
      { src: 'assets/covers/BV1eTHZ6gENk.jpg', label: '信息图解镜头', file: 'components/' },
      { src: 'assets/covers/BV1Xcpt6REr8.jpg', label: 'Agent 产出记录', file: 'preview.tsx' },
      { src: 'assets/covers/BV186pc65E68.jpg', label: 'Canvas / WebGL 参考', file: 'render' }
    ].map((asset) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = asset.src;
      return { ...asset, image };
    });
    const stages = [
      { id: 'reference', title: '先从真实参考开始', detail: '封面、仓库和时间轴进入 Agent 上下文' },
      { id: 'agent', title: 'Agent 读懂可复用结构', detail: 'Film.tsx · timeline.ts · 素材栏 / 设置 / 时间轴' },
      { id: 'remix', title: '保留节奏，换成你的内容', detail: '真实封面被重新编排成可继续修改的 Remix 输出' }
    ];
    const shots = [
      { time: 0, zoom: 1, x: 0, y: 0 },
      { time: 2.3, zoom: 1.04, x: -0.012, y: 0 },
      { time: 5.2, zoom: 1.08, x: 0.018, y: -0.012 },
      { time: 8.8, zoom: 1.03, x: 0, y: 0.012 },
      { time: 10.8, zoom: 1.07, x: -0.01, y: -0.01 },
      { time: 13.4, zoom: 1.02, x: 0.012, y: 0 },
      { time: duration, zoom: 1, x: 0, y: 0 }
    ];
    const pointer = { x: 0.5, y: 0.45, targetX: 0.5, targetY: 0.45 };
    const view = { width: 1, height: 1, ratio: 1, mobile: false };
    let playhead = 0;
    let frameId = 0;
    let lastNow = 0;
    let running = !document.hidden;
    let lastStage = '';
    let renderFrame = () => {};

    const stateAt = (time) => {
      const t = ((time % duration) + duration) % duration;
      const phase = t < 2.3 ? 'reference' : t < 10.8 ? 'agent' : 'remix';
      const activeCover = Math.min(heroAssets.length - 1, Math.max(0, Math.floor(clamp((t - 2.55) / 1.12) * heroAssets.length)));
      return {
        time: t,
        phase,
        phaseProgress: phase === 'reference' ? progress(t, 0, 2.3) : phase === 'agent' ? progress(t, 2.3, 10.8) : progress(t, 10.8, duration),
        activeCover,
        editorReveal: progress(t, 2.25, 3.05),
        dragProgress: progress(t, 3.1, 5.45),
        cutProgress: progress(t, 5.35, 6.4),
        transitionProgress: progress(t, 6.2, 8.2),
        captionProgress: progress(t, 8.1, 9.65),
        settingProgress: progress(t, 8.9, 10.55),
        remixReveal: progress(t, 10.65, 12.2),
        exportProgress: progress(t, 12.65, 15.05),
        editingPosition: t < 2.3 ? 0 : lerp(0.08, 0.92, progress(t, 2.3, 15.25)),
        loopFade: 1 - progress(t, 15.65, duration)
      };
    };

    const cameraAt = (time) => {
      const t = ((time % duration) + duration) % duration;
      const nextIndex = shots.findIndex((shot) => shot.time > t);
      const next = shots[nextIndex < 0 ? shots.length - 1 : nextIndex];
      const previous = shots[Math.max(0, nextIndex - 1)];
      const amount = progress(t, previous.time, next.time);
      return {
        zoom: lerp(previous.zoom, next.zoom, amount),
        x: lerp(previous.x, next.x, amount),
        y: lerp(previous.y, next.y, amount)
      };
    };

    const roundedPath = (x, y, width, height, radius = 10) => {
      const r = Math.min(radius, width / 2, height / 2);
      context.beginPath();
      context.moveTo(x + r, y);
      context.lineTo(x + width - r, y);
      context.quadraticCurveTo(x + width, y, x + width, y + r);
      context.lineTo(x + width, y + height - r);
      context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      context.lineTo(x + r, y + height);
      context.quadraticCurveTo(x, y + height, x, y + height - r);
      context.lineTo(x, y + r);
      context.quadraticCurveTo(x, y, x + r, y);
      context.closePath();
    };

    const panel = (x, y, width, height, fill = 'rgba(13,18,15,.78)', stroke = 'rgba(233,232,223,.16)', radius = 12) => {
      roundedPath(x, y, width, height, radius);
      context.fillStyle = fill;
      context.fill();
      context.strokeStyle = stroke;
      context.lineWidth = 1;
      context.stroke();
    };

    const label = (text, x, y, size = 12, color = '#e9e8df', options = {}) => {
      context.save();
      context.font = `${options.weight || 500} ${size}px ${options.mono ? "'DM Mono', monospace" : "Manrope, 'Noto Sans SC', sans-serif"}`;
      context.fillStyle = color;
      context.textAlign = options.align || 'left';
      context.textBaseline = options.baseline || 'alphabetic';
      context.globalAlpha = options.opacity ?? 1;
      context.fillText(text, x, y);
      context.restore();
    };

    const pill = (text, x, y, color = '#d8ff57', fill = 'rgba(216,255,87,.11)') => {
      context.save();
      context.font = "500 10px 'DM Mono', monospace";
      const width = context.measureText(text).width + 18;
      roundedPath(x, y - 16, width, 22, 11);
      context.fillStyle = fill;
      context.fill();
      context.strokeStyle = `${color}66`;
      context.stroke();
      label(text, x + width / 2, y - 1, 9, color, { mono: true, align: 'center' });
      context.restore();
      return width;
    };

    const line = (x1, y1, x2, y2, color = 'rgba(233,232,223,.18)', width = 1, dash = []) => {
      context.save();
      context.strokeStyle = color;
      context.lineWidth = width;
      context.setLineDash(dash);
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.restore();
    };

    const drawCover = (asset, x, y, width, height, options = {}) => {
      const opacity = options.opacity ?? 1;
      const radius = options.radius ?? 10;
      context.save();
      context.globalAlpha = opacity;
      roundedPath(x, y, width, height, radius);
      context.clip();
      if (asset?.image?.complete && asset.image.naturalWidth > 0) {
        const sourceRatio = asset.image.naturalWidth / asset.image.naturalHeight;
        const targetRatio = width / height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = x;
        let offsetY = y;
        if (sourceRatio > targetRatio) {
          drawWidth = height * sourceRatio;
          offsetX = x - (drawWidth - width) / 2;
        } else {
          drawHeight = width / sourceRatio;
          offsetY = y - (drawHeight - height) / 2;
        }
        context.drawImage(asset.image, offsetX, offsetY, drawWidth, drawHeight);
      } else {
        const gradient = context.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, '#526f83');
        gradient.addColorStop(0.55, '#2c3c3b');
        gradient.addColorStop(1, '#1a211d');
        context.fillStyle = gradient;
        context.fillRect(x, y, width, height);
        line(x + width * .16, y + height * .72, x + width * .84, y + height * .22, 'rgba(216,255,87,.6)', 2);
        label(asset?.label || 'LOCAL REFERENCE', x + width / 2, y + height / 2, Math.max(9, width * .055), '#d8ff57', { mono: true, align: 'center' });
      }
      context.restore();
      roundedPath(x, y, width, height, radius);
      context.strokeStyle = options.stroke || 'rgba(233,232,223,.26)';
      context.lineWidth = options.strokeWidth || 1;
      context.stroke();
      if (options.scrim) {
        context.save();
        roundedPath(x, y, width, height, radius);
        context.clip();
        context.fillStyle = options.scrim;
        context.fillRect(x, y, width, height);
        context.restore();
      }
    };

    const drawGrid = (width, height, step = 34) => {
      context.save();
      context.strokeStyle = 'rgba(233,232,223,.055)';
      context.lineWidth = 1;
      for (let x = 0; x <= width; x += step) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
      for (let y = 0; y <= height; y += step) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
      context.restore();
    };

    const drawChrome = (title, status, width) => {
      panel(22, 20, width - 44, 42, 'rgba(20,25,21,.88)', 'rgba(233,232,223,.2)', 10);
      [0, 1, 2].forEach((index) => {
        context.fillStyle = ['#d88776', '#d8c25d', '#8fc4a2'][index];
        context.beginPath();
        context.arc(40 + index * 15, 41, 4, 0, Math.PI * 2);
        context.fill();
      });
      label(title, 91, 46, 12, '#e9e8df', { mono: true });
      label(status, width - 40, 46, 10, '#d8ff57', { mono: true, align: 'right' });
    };

    const drawMiniTimeline = (state, x, y, width, height, compact = false) => {
      panel(x, y, width, height, 'rgba(13,18,15,.86)', 'rgba(233,232,223,.17)', 10);
      label('TIMELINE', x + 15, y + 22, 9, '#8f9587', { mono: true });
      const trackY = y + (compact ? 39 : 52);
      const trackHeight = compact ? 20 : 28;
      const blocks = [
        { start: 0, end: .18, color: '#86a6bd' },
        { start: .2, end: .43, color: '#d8ff57' },
        { start: .45, end: .66, color: '#b8a8db' },
        { start: .68, end: .96, color: '#d78b9b' }
      ];
      blocks.forEach((block, index) => {
        const bx = x + 16 + (width - 32) * block.start;
        const bw = (width - 32) * (block.end - block.start);
        roundedPath(bx, trackY, bw, trackHeight, 4);
        context.fillStyle = block.color;
        context.globalAlpha = .72;
        context.fill();
        context.globalAlpha = 1;
        if (!compact) label(['REF', 'CUT', 'FX', 'TYPE'][index], bx + 7, trackY + 18, 8, '#192018', { mono: true });
      });
      const playX = x + 16 + (width - 32) * state.editingPosition;
      line(playX, trackY - 7, playX, trackY + trackHeight + 13, '#ff9a85', 2);
      context.fillStyle = '#ff9a85';
      context.beginPath();
      context.moveTo(playX - 5, trackY - 8);
      context.lineTo(playX + 5, trackY - 8);
      context.lineTo(playX, trackY - 1);
      context.closePath();
      context.fill();
      if (!compact) {
        line(x + 16, trackY + trackHeight + 29, x + width - 16, trackY + trackHeight + 29, 'rgba(233,232,223,.15)');
        for (let index = 0; index < 9; index += 1) {
          const tickX = x + 16 + (width - 32) * index / 8;
          line(tickX, trackY + trackHeight + 25, tickX, trackY + trackHeight + (index % 2 ? 30 : 34), 'rgba(233,232,223,.3)');
        }
        label('0:00', x + 16, y + height - 11, 8, '#777f72', { mono: true });
        label('0:30', x + width - 16, y + height - 11, 8, '#777f72', { mono: true, align: 'right' });
      }
    };

    const drawReferenceStage = (state, width, height, mobile) => {
      const baseWidth = mobile ? 520 : 1000;
      const baseHeight = mobile ? 760 : 720;
      drawGrid(baseWidth, baseHeight, mobile ? 40 : 34);
      drawChrome('REFERENCE / OPEN MOTION', '5 LOCAL SOURCES', baseWidth);
      const reveal = state.phaseProgress;
      if (mobile) {
        drawCover(heroAssets[0], 28, 86, 300, 190, { opacity: progress(reveal, 0, .3), radius: 16 });
        drawCover(heroAssets[1], 342, 120, 145, 112, { opacity: progress(reveal, .18, .45), radius: 12 });
        panel(28, 300, 459, 88, 'rgba(13,18,15,.86)');
        pill('SOURCE VIDEO', 44, 329, '#8ec9ff', 'rgba(142,201,255,.1)');
        label('Bilibili / code-to-video reference', 44, 355, 15, '#e9e8df', { weight: 700 });
        label('BV1vRHa63EYg  ·  来源与许可待核验', 44, 377, 10, '#8f9587', { mono: true });
        panel(28, 408, 459, 102, 'rgba(13,18,15,.86)');
        label('REPOSITORY CONTEXT', 44, 435, 9, '#8f9587', { mono: true });
        label('WiseWong6/claude-video-editing-remotion', 44, 461, 12, '#d8ff57', { mono: true });
        ['Film.tsx', 'timeline.ts', 'components/'].forEach((file, index) => pill(file, 44 + index * 113, 490, index === 1 ? '#8ec9ff' : '#d8ff57'));
        drawMiniTimeline(state, 28, 536, 459, 105, true);
      } else {
        panel(28, 84, 604, 344, 'rgba(13,18,15,.78)');
        label('REFERENCE MEDIA', 50, 113, 10, '#8f9587', { mono: true });
        const positions = [[50, 136], [182, 136], [50, 252], [182, 252]];
        heroAssets.slice(0, 4).forEach((asset, index) => {
          const amount = progress(reveal, index * .14, .34 + index * .08);
          const [x, y] = positions[index];
          drawCover(asset, x, y + (1 - amount) * 25, 112, 83, { opacity: amount, radius: 7 });
          label(asset.label, x, y + 98 + (1 - amount) * 25, 9, '#9ba497', { mono: true, opacity: amount });
        });
        panel(322, 136, 286, 199, 'rgba(36,52,47,.9)', 'rgba(216,255,87,.32)', 14);
        drawCover(heroAssets[0], 337, 151, 256, 137, { radius: 10, scrim: 'rgba(20,28,24,.18)' });
        pill('ACTIVE REFERENCE', 339, 316, '#d8ff57');
        label('逐帧代码视频 / 4410 frames', 339, 350, 11, '#e9e8df', { mono: true });
        panel(656, 84, 316, 344, 'rgba(13,18,15,.84)');
        label('REPOSITORY CONTEXT', 681, 116, 10, '#8f9587', { mono: true });
        label('WiseWong6/', 681, 151, 13, '#e9e8df', { mono: true });
        label('claude-video-editing-', 681, 174, 13, '#d8ff57', { mono: true });
        label('remotion', 681, 197, 13, '#d8ff57', { mono: true });
        line(681, 218, 947, 218, 'rgba(233,232,223,.16)');
        ['src/Film.tsx', 'src/timeline.ts', 'src/components/', 'scripts/verify'].forEach((file, index) => {
          context.fillStyle = index === 1 ? '#d8ff57' : '#8ec9ff';
          context.fillRect(681, 244 + index * 34, 7, 7);
          label(file, 699, 252 + index * 34, 11, '#aeb5a8', { mono: true });
        });
        pill('MIT CODE', 681, 393, '#d8ff57');
        pill('ASSETS SEPARATE', 774, 393, '#ffad91', 'rgba(255,173,145,.1)');
        drawMiniTimeline(state, 28, 464, 944, 138);
        label('VIDEO → README → TIMELINE', 50, 630, 10, '#8f9587', { mono: true });
        label('AGENT CONTEXT', 950, 630, 10, '#d8ff57', { mono: true, align: 'right' });
      }
    };

    const drawAgentStage = (state, width, height, mobile) => {
      const baseWidth = mobile ? 520 : 1000;
      const baseHeight = mobile ? 760 : 720;
      drawGrid(baseWidth, baseHeight, mobile ? 40 : 34);
      drawChrome('AGENT WORKSPACE / REMIX', 'RUNNING CHECKS', baseWidth);
      const reveal = state.editorReveal;
      if (mobile) {
        panel(20, 78, 480, 216, 'rgba(13,18,15,.86)', 'rgba(142,201,255,.24)', 14);
        label('PREVIEW / REFERENCE STRUCTURE', 38, 105, 9, '#8f9587', { mono: true });
        drawCover(heroAssets[state.activeCover % heroAssets.length], 38, 122, 272, 150, { radius: 10, opacity: reveal });
        panel(325, 122, 157, 150, 'rgba(30,43,38,.82)', 'rgba(216,255,87,.25)', 10);
        ['Film.tsx', 'timeline.ts', 'Editor.tsx', 'verify ✓'].forEach((file, index) => {
          context.fillStyle = index === 3 ? '#d8ff57' : '#8ec9ff';
          context.fillRect(340, 146 + index * 25, 6, 6);
          label(file, 355, 152 + index * 25, 10, '#b5bdb2', { mono: true });
        });
        panel(20, 310, 480, 79, 'rgba(13,18,15,.86)');
        label('ASSETS', 38, 334, 9, '#8f9587', { mono: true });
        heroAssets.slice(0, 4).forEach((asset, index) => {
          const x = 98 + index * 95;
          drawCover(asset, x, 318, 70, 48, { radius: 5, opacity: .78 });
          if (index === state.activeCover % 4) { roundedPath(x - 3, 315, 76, 54, 7); context.strokeStyle = '#d8ff57'; context.stroke(); }
        });
        drawMiniTimeline(state, 20, 410, 480, 126, true);
        panel(20, 556, 480, 82, 'rgba(13,18,15,.86)');
        label('PARAMETERS', 38, 580, 9, '#8f9587', { mono: true });
        ['FLASH', 'SATURATION', 'PUNCH'].forEach((name, index) => {
          const x = 38 + index * 150;
          label(name, x, 602, 8, '#b5bdb2', { mono: true });
          line(x, 616, x + 115, 616, 'rgba(233,232,223,.18)', 4);
          line(x, 616, x + 115 * [state.settingProgress, .36 + state.settingProgress * .48, state.transitionProgress][index], 616, index === 1 ? '#8ec9ff' : '#d8ff57', 4);
        });
        context.save();
        context.translate(425 + Math.sin(state.time * 6) * 8, 370 + state.dragProgress * 60);
        context.strokeStyle = '#d8ff57';
        context.lineWidth = 2;
        context.beginPath(); context.arc(0, 0, 10, 0, Math.PI * 2); context.stroke();
        line(-5, 5, -25, 24, '#d8ff57', 2);
        context.restore();
      } else {
        panel(28, 84, 208, 342, 'rgba(13,18,15,.86)');
        label('ASSETS', 48, 112, 10, '#8f9587', { mono: true });
        ['素材', '转场', '文字'].forEach((name, index) => {
          const x = 46 + index * 56;
          roundedPath(x, 127, 50, 23, 6);
          context.fillStyle = index === 0 ? 'rgba(216,255,87,.22)' : 'rgba(233,232,223,.05)';
          context.fill();
          label(name, x + 25, 143, 9, index === 0 ? '#d8ff57' : '#848c80', { align: 'center' });
        });
        heroAssets.slice(0, 4).forEach((asset, index) => {
          const x = 48 + (index % 2) * 87;
          const y = 168 + Math.floor(index / 2) * 91;
          drawCover(asset, x, y, 76, 57, { radius: 5, opacity: .88 });
          label(`${index + 1}.0s`, x, y + 70, 8, '#8f9587', { mono: true });
          if (index === state.activeCover % 4 && state.phase === 'agent') {
            roundedPath(x - 4, y - 4, 84, 65, 8);
            context.strokeStyle = '#d8ff57'; context.lineWidth = 2; context.stroke();
          }
        });
        panel(252, 84, 454, 342, 'rgba(22,34,31,.84)', 'rgba(142,201,255,.28)');
        label('PREVIEW / CLAUDE VIDEO EDITING', 274, 112, 10, '#8f9587', { mono: true });
        drawCover(heroAssets[state.activeCover % heroAssets.length], 274, 130, 410, 216, { radius: 10, scrim: 'rgba(18,28,24,.14)' });
        pill('READING SOURCE', 292, 378, '#8ec9ff', 'rgba(142,201,255,.1)');
        label('preserve rhythm / replace content', 410, 377, 11, '#d8ff57', { mono: true });
        panel(722, 84, 250, 342, 'rgba(13,18,15,.86)');
        label('PARAMETERS', 744, 112, 10, '#8f9587', { mono: true });
        ['FLASH', 'SATURATION', 'ZOOM PUNCH'].forEach((name, index) => {
          const y = 158 + index * 74;
          label(name, 744, y, 9, '#b5bdb2', { mono: true });
          const amount = [state.settingProgress, .38 + state.settingProgress * .46, state.transitionProgress][index];
          line(744, y + 24, 940, y + 24, 'rgba(233,232,223,.15)', 5);
          line(744, y + 24, 744 + 196 * amount, y + 24, index === 1 ? '#8ec9ff' : '#d8ff57', 5);
          context.fillStyle = '#e9e8df';
          context.beginPath(); context.arc(744 + 196 * amount, y + 24, 6, 0, Math.PI * 2); context.fill();
          label(`${Math.round(amount * 100)}%`, 940, y + 8, 9, '#8f9587', { mono: true, align: 'right' });
        });
        drawMiniTimeline(state, 28, 458, 944, 138);
        if (state.dragProgress > 0 && state.dragProgress < 1) {
          const startX = 90 + state.activeCover % 2 * 87;
          const startY = 194 + Math.floor(state.activeCover % 4 / 2) * 91;
          const endX = 330 + state.dragProgress * 230;
          const endY = 510;
          line(startX, startY, endX, endY, 'rgba(216,255,87,.75)', 2, [5, 6]);
          context.fillStyle = '#d8ff57';
          context.beginPath(); context.arc(endX, endY, 8, 0, Math.PI * 2); context.fill();
          pill('AGENT', endX - 23, endY - 14, '#d8ff57');
        }
        label('README', 52, 630, 9, '#8ec9ff', { mono: true });
        label('TIMELINE', 164, 630, 9, '#8ec9ff', { mono: true });
        label('CHECK ✓', 870, 630, 9, '#d8ff57', { mono: true });
      }
    };

    const drawRemixStage = (state, width, height, mobile) => {
      const baseWidth = mobile ? 520 : 1000;
      const baseHeight = mobile ? 760 : 720;
      drawGrid(baseWidth, baseHeight, mobile ? 40 : 34);
      drawChrome('REMIX OUTPUT / OPEN MOTION', 'READY TO EDIT', baseWidth);
      const reveal = state.remixReveal;
      if (mobile) {
        panel(24, 84, 472, 390, 'rgba(13,18,15,.88)', 'rgba(216,255,87,.35)', 18);
        drawCover(heroAssets[3], 45, 106 + (1 - reveal) * 42, 430, 270, { radius: 14, opacity: reveal, scrim: 'rgba(20,25,18,.1)' });
        pill('REMIX OUTPUT', 45, 414, '#d8ff57');
        label('YOUR CONTENT', 45, 448, 22, '#e9e8df', { weight: 800 });
        label('同一套节奏 · 全新的内容', 45, 470, 11, '#aeb5a8', { mono: true });
        drawMiniTimeline(state, 24, 500, 472, 105, true);
        line(45, 646, 475, 646, 'rgba(233,232,223,.16)', 4);
        line(45, 646, 45 + 430 * state.exportProgress, 646, '#d8ff57', 4);
        label(`EXPORT ${Math.round(state.exportProgress * 100)}%`, 45, 674, 10, '#d8ff57', { mono: true });
        label('README + SOURCE + LICENSE', 475, 674, 9, '#8f9587', { mono: true, align: 'right' });
      } else {
        panel(82, 84, 836, 448, 'rgba(13,18,15,.88)', 'rgba(216,255,87,.32)', 20);
        drawCover(heroAssets[3], 112, 116 + (1 - reveal) * 55, 500, 316, { radius: 16, opacity: reveal, scrim: 'rgba(20,25,18,.08)' });
        panel(644, 116, 242, 316, 'rgba(27,42,34,.88)', 'rgba(216,255,87,.32)', 14);
        pill('REMIX OUTPUT', 668, 150, '#d8ff57');
        label('YOUR', 668, 202, 40, '#e9e8df', { weight: 800 });
        label('MOTION', 668, 242, 40, '#d8ff57', { weight: 800 });
        line(668, 266, 856, 266, 'rgba(233,232,223,.2)');
        ['same timeline', 'new content', 'ready to edit'].forEach((text, index) => {
          context.fillStyle = index === 1 ? '#d8ff57' : '#8ec9ff';
          context.beginPath(); context.arc(676, 297 + index * 32, 4, 0, Math.PI * 2); context.fill();
          label(text, 691, 301 + index * 32, 11, '#aeb5a8', { mono: true });
        });
        drawMiniTimeline(state, 82, 558, 836, 94);
        line(112, 682, 888, 682, 'rgba(233,232,223,.16)', 4);
        line(112, 682, 112 + 776 * state.exportProgress, 682, '#d8ff57', 4);
        label(`EXPORT ${Math.round(state.exportProgress * 100)}%`, 112, 704, 10, '#d8ff57', { mono: true });
        label('README / LICENSE / SOURCE READY', 888, 704, 9, '#8f9587', { mono: true, align: 'right' });
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const cssWidth = Math.max(1, rect.width);
      const cssHeight = Math.max(1, rect.height);
      const maxPixels = 1200000;
      const deviceRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const ratio = Math.min(deviceRatio, Math.sqrt(maxPixels / (cssWidth * cssHeight)) || 1);
      canvas.width = Math.max(1, Math.round(cssWidth * ratio));
      canvas.height = Math.max(1, Math.round(cssHeight * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      view.width = cssWidth;
      view.height = cssHeight;
      view.ratio = ratio;
      view.mobile = cssWidth < 560;
      renderFrame(playhead);
    };

    renderFrame = (time) => {
      const state = stateAt(time);
      const width = view.width;
      const height = view.height;
      const mobile = view.mobile;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#20281f';
      context.fillRect(0, 0, width, height);
      const camera = cameraAt(state.time);
      const baseWidth = mobile ? 520 : 1000;
      const baseHeight = mobile ? 760 : 720;
      const scale = Math.min(width / baseWidth, height / baseHeight) * camera.zoom;
      const offsetX = (width - baseWidth * scale) / 2 + camera.x * width + (pointer.x - .5) * (mobile ? 8 : 16);
      const offsetY = (height - baseHeight * scale) / 2 + camera.y * height + (pointer.y - .45) * (mobile ? 8 : 14);
      context.save();
      context.translate(offsetX, offsetY);
      context.scale(scale, scale);
      if (state.phase === 'reference') drawReferenceStage(state, baseWidth, baseHeight, mobile);
      else if (state.phase === 'agent') drawAgentStage(state, baseWidth, baseHeight, mobile);
      else drawRemixStage(state, baseWidth, baseHeight, mobile);
      context.restore();
      const stage = stages.find((item) => item.id === state.phase);
      if (stage && stage.id !== lastStage) {
        lastStage = stage.id;
        if (heroSceneTitle) heroSceneTitle.textContent = stage.title;
        if (heroSceneDetail) heroSceneDetail.textContent = stage.detail;
      }
    };

    const tick = (now) => {
      if (!running || reduceMotion) return;
      if (!lastNow) lastNow = now;
      const delta = Math.min((now - lastNow) / 1000, .05);
      lastNow = now;
      playhead = (playhead + delta) % duration;
      pointer.x += (pointer.targetX - pointer.x) * (1 - Math.exp(-8 * delta));
      pointer.y += (pointer.targetY - pointer.y) * (1 - Math.exp(-8 * delta));
      renderFrame(playhead);
      frameId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      if (reduceMotion) {
        playhead = 13.8;
        renderFrame(playhead);
        return;
      }
      lastNow = performance.now();
      frameId = window.requestAnimationFrame(tick);
    };

    heroAssets.forEach((asset) => {
      asset.image.addEventListener('load', () => renderFrame(playhead), { once: true });
      asset.image.addEventListener('error', () => renderFrame(playhead), { once: true });
    });
    canvas.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = clamp((event.clientX - rect.left) / rect.width);
      pointer.targetY = clamp((event.clientY - rect.top) / rect.height);
    });
    canvas.addEventListener('pointerleave', () => { pointer.targetX = .5; pointer.targetY = .45; });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (!running) {
        window.cancelAnimationFrame(frameId);
        lastNow = 0;
      } else start();
    });
    const onReduceChange = (event) => {
      reduceMotion = event.matches;
      start();
    };
    if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', onReduceChange);
    else reduceQuery.addListener(onReduceChange);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    start();
  }

  loadDiscussions();
})();
