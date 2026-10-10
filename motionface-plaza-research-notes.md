# Motion Face Plaza 中文调研笔记

## 0. 调查范围、时间与证据口径

- **访问时间**：2026-10-09 17:25（UTC+8；以本次调查会话时间为准）。
- **调查入口**：<https://motionface.cc/?view=plaza>
- **资料范围**：只使用 Motion Face 公开页面、站内路由、网站公开静态脚本/CSS、脚本中配置的公开 Supabase REST/RPC 响应，以及站内隐私政策/充值/帮助型指南内容；未使用搜索引擎二手文章。
- **操作边界**：未登录、未上传、未付款、未投票、未绑定仓库、未执行删除或其他写操作。API 调查仅使用公开 GET，以及读取赞踩统计的公开 RPC。
- **数据快照提示**：广场内容、计数、排序和公开仓库数量会变化；下文的数量均是本次访问窗口的快照，不应当视为长期统计。

## 1. 一句话结论

Motion Face 把“收集动效参考—用 AI/Remotion 复刻—绑定公开 GitHub 代码—让其他人 remix/解锁”的链路做成了一个社区型动效片段库。Plaza 的发现和筛选对访客可见，但完整详情、播放/预览、复刻提示词和代码互动都以 GitHub 登录为重要前置；因此“公开”主要表示片段进入公共广场，不等于匿名访客可以完整观看或取得代码。

**主要证据**：首页主文案、Plaza 页面、前端路由与接口调用、隐私政策；来源分别见 <https://motionface.cc/>、<https://motionface.cc/?view=plaza>、<https://motionface.cc/assets/index-BaQDJz0T.js>、<https://motionface.cc/privacy>。

## 2. 网站定位与目标用户

### 2.1 定位

- 首页将核心价值概括为“**一人复刻，万人共享**”：一个人用 AI 复刻好的动效代码，其他人可以直接 remix 成自己的内容。
- 首页把传统流程写成“找参考 → AI 代码复刻 → remix 内容”，Motion Face 流程写成“找参考 → remix 内容”，并宣称“tokens 消耗减少 **95%**”。这是站方营销/产品主张，不是本次独立测量结果。
- 网站产品并不只是展示视频：它把视频片段、复刻提示词、Remotion 代码仓库和 Face 激励/解锁机制连在一起。

**来源**：<https://motionface.cc/>；同样的 Hero 和指南内容也在 <https://motionface.cc/?view=plaza> 中出现。

### 2.2 目标用户

- **想找动效灵感并用代码还原的人**：站内指南明确说“广场视频复刻”适合“在社区发现喜欢的动效，想用代码还原并分享的你”。
- **已有 Remotion 项目的人**：指南提供“现有 Remotion 项目”流程，将渲染、发布、绑定仓库交给 AI 助手执行。
- **使用 AI 编程工具的人**：复刻提示词要求 AI 分析参考视频、使用 Remotion，并创建/推送公开 GitHub 仓库；提示词还提到 Claude Code、Opus 5.5 等外部工具。
- **Pinterest/网页动效收藏者**：浏览器插件指南支持从 Pinterest Pin 获取视频，也支持录制普通网页动效；片段随后进入同一“我的动效片段”库。
- **已有本地视频、希望自己整理发布的人**：手动流程支持本地 MP4/WebM 上传、改标题/介绍、绑定代码、发布到广场。
- **需要定做字幕/口播动效视频的人**：首页另有“视频定做 op55”产品，支持上传口播或带歌词音乐、转字幕、逐条校对、选择风格和比例，再发布任务让创作者接单；这是 Plaza 的相邻产品，不是 Plaza 核心流程。

**来源**：首页分享指南（含 4 个标签页）<https://motionface.cc/>；任务/示例 <https://motionface.cc/op55>、<https://motionface.cc/op55/examples>。

## 3. Plaza 页面功能与信息架构

### 3.1 页面层级

1. **站点头部导航**：`视频定做 op55`、`动效广场`、`我的动效片段`，右侧是 GitHub 登录/账户入口。
2. **Plaza Hero/指南入口**：介绍“找参考 → remix”的产品概念；“如何分享动效片段”打开站内指南。
3. **广场集合区**：标题“探索动效广场”，搜索框、标签、时长、排序、瀑布流卡片和分页。
4. **详情弹窗**：原始片段播放器、时长/文件大小/尺寸、标题和介绍、赞踩、Remotion 复刻仓库、分享和片段管理。
5. **站点页脚**：vibe-motion 社区 GitHub 链接和 ICP 备案链接；主应用页脚未看到隐私政策/条款链接，隐私政策可通过直接 URL 访问。

**来源**：Plaza 文本 <https://motionface.cc/?view=plaza>；页面结构、导航和详情模板 <https://motionface.cc/assets/index-BaQDJz0T.js>。

### 3.2 广场集合区的控件

- **标题搜索**：输入框提示为“搜索动效片段标题…”。前端查询只对 `recordings.title` 做不区分大小写的模糊匹配；没有看到按介绍、作者或代码内容搜索。
- **动效标签**：
  - 文字排版：标题、字标、动态排版、文字循环；
  - 信息图解：图表、地图、流程、视觉比喻；
  - 界面演示：软件操作、交互反馈、卡片和内容画廊；
  - 场景叙事：人物、物件、连续场景、情绪表达；
  - 背景特效：粒子、材质、循环背景、转场和画面效果。
- **时长筛选**：`不限时长`、`超过 30 秒`。
- **排序**：`点赞最多`、`最新发布`、`最早发布`、`踩数最多`；默认值是点赞最多。
- **分页**：前端每页请求 18 条，并显示总条数和页码。

**来源**：界面文案和查询逻辑 <https://motionface.cc/assets/index-BaQDJz0T.js>；同样的可见控件见 <https://motionface.cc/?view=plaza>。

### 3.3 卡片/详情展示的信息

- 卡片使用视频封面或占位图，显示标题、上传时间、公开状态、时长、作者/账户头像信息和“已复刻”标记。
- “已复刻”由是否存在 `recording_repository_previews` 记录决定，表示至少有一个代码仓库预览记录；它不等于当前访客已经获得仓库 URL。
- 详情中有“原始片段”、时长、文件大小、画面尺寸、标题、介绍、赞踩、`Remotion 复刻`仓库区和分享按钮。
- 站方把仓库 URL 按“绑定”处理，而不是直接把源代码托管在站内；提示词要求复刻者创建公开 GitHub 仓库并绑定回原片段。

**来源**：卡片/详情模板 <https://motionface.cc/assets/index-BaQDJz0T.js>；仓库与分享提示 <https://motionface.cc/>。

## 4. 本次公开内容快照

### 4.1 数量与文件属性

通过前端公开脚本使用的 Supabase REST 查询读取 `recordings` 的公开、已完成记录：

```text
GET https://chfjrlcbcmvlqwjesgtr.supabase.co/rest/v1/recordings
  ?select=*,profile:profiles!recordings_profile_fkey(id,display_name,avatar_color,face),repositories:recording_repository_previews(id)
  &deleted_at=is.null&visibility=eq.public&status=eq.ready
  &order=created_at.desc,id.desc&limit=100
```

本次响应结果：

- **97** 条公开且 `ready` 的片段；
- **97/97** 的 `mime_type` 是 `video/mp4`；虽然上传控件接受 MP4/WebM，本次广场快照中没有公开 WebM；
- 90 条带有至少一个仓库预览 ID，7 条没有仓库预览 ID；
- 时长范围 **2.048–120 秒**，中位数约 **10.048 秒**；其中 8 条超过 30 秒；
- 画幅混合：常见有 1920×1080、1280×720、720×1280、1080×1920，也有 3072×4096、3840×2160 等高分辨率记录；
- 公开数据包含标题、作者显示名、上传时间、时长、尺寸、文件大小、`user_id`、`object_key` 等元数据。

**来源**：前端查询定义 <https://motionface.cc/assets/index-BaQDJz0T.js>；公开 REST 服务 <https://chfjrlcbcmvlqwjesgtr.supabase.co/rest/v1/recordings>。上面的统计是本次调查对该查询结果的本地汇总。

### 4.2 可见作品类型与例子

按前端脚本内置的 UUID 标签映射，本次 97 条记录分布为：

- 文字排版 24 条；
- 信息图解 23 条；
- 界面演示 17 条；
- 场景叙事 11 条；
- 背景特效 16 条；
- **6 条未出现在当前脚本的标签 UUID 映射中**。

作品标题例子包括：

- **文字/标题模板**：`黄铜表 · 动态标题模板`、`极坐标徽 · 动态标题模板`、`纸层隧道 · 动态标题模板`、`MOTION 文字弹球`；
- **信息图/流程**：`排行榜动画 ranking animation`、`K线展示`、`任务流转与分级检查｜流程讲解动效`、`一张卡拆成两类｜分类对比动效`；
- **界面/产品演示**：`Claude Code 镜像窗`、`文件自动归类`、`AI 输入页(可换 AI)`、`六卡片 · 连续运镜空间画廊`；
- **场景叙事**：`太阳下班`、`树上的秋天化作了月光`、`Discipline · 自律与时间`、`生活与交易 · 镜像叙事`；
- **背景/特效**：`引力光群 · 原创 03`、`棱镜阵列 · 原创 02`、`液态金属环 · 原创 01`、`热成像扫描加载`；
- **最新但未映射的例子**：`星月来信：文字化作星月，汇入银河`、`小猫加工厂`、`芯片弹跳 · 动态标题模板`、`astra-motion`。

**来源**：公开 REST 查询结果；标签描述和 UUID 映射 <https://motionface.cc/assets/index-BaQDJz0T.js>。标签映射是前端静态配置，不是从数据库读取的分类字段。

### 4.3 评价/排序的实际线索

- 前端通过 `get_recording_feedback_v2` 读取赞踩和仓库数量；匿名公开 RPC 读取结果包含 `upvotes`、`downvotes`、`repository_count` 等字段。
- 以本次快照的数据库排序字段为例，点赞最多的样本是 `claude_剪视频过程motion`（85 赞），其次有 `立体书：约束越多，作品越能脱颖而出`（32 赞）；踩数最多的样本为 `天平倾斜与镜头推进｜权衡选择动效`（15 踩）。这些数字是瞬时快照。

**来源**：前端赞踩逻辑 <https://motionface.cc/assets/index-BaQDJz0T.js>；公开 RPC <https://chfjrlcbcmvlqwjesgtr.supabase.co/rest/v1/rpc/get_recording_feedback_v2>。

## 5. 核心用户流程

### 5.1 匿名访客：发现与浏览

1. 打开 Plaza；
2. 浏览卡片、缩略图、标题、时长和“已复刻”状态；
3. 使用搜索、标签、时长和排序筛选；
4. 点击卡片/详情时，前端会先提示“请先使用 GitHub 登录，再查看动效详情”。

本次对公开片段 ID `2b32f19d-076d-4db6-97bd-b98d4111beff` 做了只读验证：匿名 `GET /api/recordings/{id}/thumbnail` 返回 JPEG；匿名 `GET /api/recordings/{id}/play` 和 `/preview` 均返回 `401 {"error":"请先登录 GitHub"}`。因此，匿名可看到公共元数据和缩略图，但实际播放器/预览的访客权限需要进一步产品确认。

**来源**：前端详情入口和播放调用 <https://motionface.cc/assets/index-BaQDJz0T.js>；接口实测来源 <https://motionface.cc/api/recordings/2b32f19d-076d-4db6-97bd-b98d4111beff/play>、<https://motionface.cc/api/recordings/2b32f19d-076d-4db6-97bd-b98d4111beff/preview>、<https://motionface.cc/api/recordings/2b32f19d-076d-4db6-97bd-b98d4111beff/thumbnail>。

### 5.2 登录与完整 Plaza 体验

- 登录按钮调用 Supabase Auth 的 GitHub OAuth：`provider:"github"`，PKCE 流程，回跳站点首页；站方称“与插件相同的 GitHub 账号”。
- 登录后才能打开详情播放器、复制提示词、投票、进入自己的片段库和上传。
- 站方不要求用户把 GitHub 密码交给扩展/网站；隐私政策说明账号身份、名称、头像和可用邮箱由 GitHub/Supabase 提供。

**来源**：OAuth 调用 <https://motionface.cc/assets/index-BaQDJz0T.js>；隐私政策 <https://motionface.cc/privacy>。

### 5.3 从广场视频复刻并绑定代码

1. 登录 Motion Face，在广场找到视频；
2. 对卡片右键，或点击右上角“⋯”；
3. 选择“复制复刻 prompts”；已有仓库时显示“复制复刻 prompts（追加）”，自己已经绑定时显示“复制复刻 prompts（已绑定）”；
4. 站点通过 `/api/recordings/{id}/replication-task` 生成提示词并写入剪贴板；
5. 提示词要求 AI 用 Remotion 分析视频、创建公开 GitHub 仓库、推送源码和依赖，再用片段专属凭证绑定仓库；
6. 绑定成功后，片段显示“已复刻”，其他用户可按规则解锁代码仓库。

提示词内的访问凭证不是普通登录令牌：站方说明视频签名地址约一小时有效，仓库绑定凭证通常 24 小时有效，且凭证只限当前片段、不允许发布视频。不得把提示词、签名视频地址或凭证提交到 GitHub 仓库/日志。

**来源**：站内指南 <https://motionface.cc/>；复刻提示词生成和有效期说明 <https://motionface.cc/assets/index-BaQDJz0T.js>；隐私政策 <https://motionface.cc/privacy>。

### 5.4 手动上传、整理、发布

- 进入“我的动效片段”→“片段库”→“上传动效片段”，选择本地 MP4/WebM。
- 前端校验单个文件不超过 **100 MB**，读取视频元数据后通过上传接口取得签名 PUT 地址，再调用完成接口和缩略图接口。
- 新上传片段默认仅自己可见；详情中可以编辑标题和介绍，绑定 GitHub 仓库，再选择“发布到广场”。
- 标题前端长度上限为 160 个字符，介绍上限为 2000 个字符。
- 发布后可以复制 `/?recording={id}` 分享链接；自己的片段可以撤回公开、移到回收站、恢复，清空回收站会永久删除片段及对应视频文件。
- 站内指南写明每人每天最多上传 10 个视频；创建上传即占用名额，失败重试同一上传不重复计，删除不返还。

**来源**：手动流程指南 <https://motionface.cc/>；上传/编辑/回收站实现 <https://motionface.cc/assets/index-BaQDJz0T.js>；回收站提示也见 <https://motionface.cc/?view=plaza>。

### 5.5 赞踩和社区反馈

- 已登录用户可以对其他人的公开、已完成、未删除片段点赞或踩；不能评价自己的视频。
- 一般用户再次点击可取消或换边；站内提示有效赞/踩按北京时间次日 03:00 结算 Face。
- Plaza 排序直接提供点赞最多和踩数最多；因此赞踩既是互动机制，也是发现排序信号。

**来源**：赞踩校验、RPC 和 UI 提示 <https://motionface.cc/assets/index-BaQDJz0T.js>；充值规则页 <https://motionface.cc/recharge>。

## 6. 商业化、奖励与限制

- 首页/指南同时写有“Motion Face 不以盈利为目的”，但站点确实存在 Face 充值和代码解锁：
  - 充值页显示 1 元 = 10 Face；预设金额为 10/30/66/100 元，100 元档显示 10% 赠送；
  - 解锁一个视频的全部 GitHub 代码链接需要 **10 Face**，从付款起计算一个自然月有效；上传者免费查看；
  - 公开视频的绑定提示称，上传者可直接查看，其他人需花 10 Face 解锁本视频全部仓库链接；
  - 充值页支持支付宝流程，但登录后才能充值。
- 激励：
  - 新账号 10 Face；
  - AI 复刻/分享每次最高 +5，每天最多 20；
  - 有效赞最高 +5，踩 −2，次日北京时间 03:00 结算；
  - 新账号、AI 复刻/分享、赞踩奖励合计每天最多 100 Face，充值不计入。
- 其他限制：
  - 每人每天最多上传 10 个视频；
  - 同一账号对同一片段/同一仓库的 AI 分享奖励限领一次；
  - 绑定规则是每人对每个片段可绑定一个仓库；同一片段可有多位用户分别绑定仓库；
  - 公开仓库 URL 必须是 GitHub 仓库根地址，前端限制最大 250 字符。
- 相邻的 op55 定做产品不是 Plaza 的代码解锁，但有明确任务经济规则：首页显示每单起步 30 Face、每条字幕另加 10 Face、含 10% 服务费，发布时托管，7 天无人接单全额退回，交付后 36 小时未处理自动收货。

**来源**：<https://motionface.cc/recharge>、<https://motionface.cc/>、仓库绑定逻辑 <https://motionface.cc/assets/index-BaQDJz0T.js>。以上是站内公开规则的转述，未独立验证支付或奖励是否实际到账。

## 7. 技术与性能线索（仅写已观察证据）

- **应用形态**：首页 HTML 是一个很小的 SPA 壳，`<div id="app"></div>`，加载 `/assets/index-BaQDJz0T.js` 和 `/assets/index-DXffe6FT.css`；代码形态与 Vite 构建产物一致。
- **响应头/托管**：本次请求看到 `Server: edgeone makers`、`Content-Encoding: br`；HTML 使用 `max-age=0,must-revalidate`，JS/CSS 使用 `public,max-age=31536000,immutable`。站方隐私政策也明确列出 EdgeOne 托管网站/API、腾讯云 COS 存储、Supabase 鉴权/数据库。
- **解压后资源体积**：HTML 793 字节、主 JS 约 506 KB、主 CSS 约 119 KB。Python 请求的单次耗时样本约为 HTML 0.7 秒、JS 1.3 秒、CSS 1.6 秒；这是当前网络环境的一次抓取，不是受控性能基准。
- **数据访问**：浏览器直接使用 Supabase 客户端和公开 publishable key；Plaza 查询按 18 条分页，并设置约 15 秒读取超时。反馈通过公开 RPC 读取；写入/投票/绑定需要登录会话。
- **播放/预览**：播放 URL 通过站内 API 临时签发；前端在本地 `localStorage` 中缓存最多约 120 个播放地址，并限制缓存地址有效期不超过约 59 分钟。卡片封面使用 IntersectionObserver 懒加载；悬停预览仅在登录条件满足时启动，且前端限制预览文件约 256 KB、最长边 480px、片段约 2.2 秒以内。
- **上传链路**：先创建上传记录，再从站内 API 获取签名 PUT URL，直传视频，调用 complete，再尝试上传 JPEG 缩略图；单个上传请求的前端超时设置为 900 秒。

**来源**：HTTP 响应和资源 <https://motionface.cc/?view=plaza>、<https://motionface.cc/assets/index-BaQDJz0T.js>、<https://motionface.cc/assets/index-DXffe6FT.css>；服务商声明 <https://motionface.cc/privacy>。性能数字只代表本次观察。

## 8. 隐私与安全提示

### 8.1 站方公开声明

隐私政策生效日期为 **2026-09-25**，适用于浏览器扩展和 motionface.cc 社区。它声明：

- 处理 GitHub/Supabase 账号身份、名称、头像、可用邮箱和认证会话；
- 处理用户主动录制的网页画面、网页声音/麦克风音频、导入/上传视频、缩略图和片段元数据；
- 处理本地录制设置、上传进度、草稿、待上传缓存、裁剪和任务恢复状态；
- 基础设施处理 IP、时间和必要的运行/安全日志；不含广告跟踪或独立行为分析 SDK；
- 新上传片段默认为个人草稿，公开发布后展示资料可被其他访客访问；
- 使用 GitHub、Supabase、腾讯云 COS、腾讯云 EdgeOne；
- 视频使用私有存储和短期签名地址；提示词带有短期视频 URL 和片段专属仓库绑定凭证；
- 不出售用户数据，不用于广告、信用评估或放贷；
- 回收站可恢复，清空回收站永久清理对应片段和文件；卸载扩展不会自动删除云端片段或已下载的本地文件。

**来源**：<https://motionface.cc/privacy>。

### 8.2 使用者应特别注意

- 录屏可能包含网页中显示的个人信息，开始前应检查录制范围。
- 不要公开分享草稿的签名 URL、复制出来的复刻提示词或临时仓库绑定凭证。
- 外部 AI 工具只有在用户把提示词粘贴给它后，才会接触提示词中的短期视频地址；该工具的处理受其自身政策约束。
- “公开片段”并不代表源视频永久公开：站方称撤回后不再生成新的公开播放地址，但此前签发的短期地址在剩余有效期内可能仍可访问，最长约一小时。
- 公开 GitHub 仓库应避免提交提示词中的凭证、签名地址、`.env`、原始私密音频或其他不应公开的文件。

## 9. 明显问题、矛盾与待验证项

以下项目是调查中有直接迹象的风险/疑点，不把它们直接定性为漏洞：

1. **公共可见与匿名播放语义不一致**  
   Plaza 可加载公共元数据和缩略图，但前端详情入口要求 GitHub 登录，匿名播放/预览接口实测返回 401。需要确认产品是否有意把“公开”定义为“公共索引 + 登录后查看”，以及分享给未登录用户时应显示什么。

2. **标签映射可能滞后**  
   API 快照有 97 条公共记录，而当前脚本硬编码的五类 UUID 只覆盖 91 条；最新的 6 条没有出现在任何标签数组中。由于标签筛选使用 `id in (硬编码数组)`，这 6 条在按类别筛选时可能无法出现。需要确认是故意未分类，还是发布新片段后忘记更新前端构建。

3. **公开 API 返回了疑似不必要的账户余额字段**  
   前端对公共记录使用 `select=*`，并显式选择 `profile(...,face)`；本次匿名 REST 响应的 `profile.face` 对公共作者为非空数值，虽然 Plaza UI 没有显著展示余额。应确认 Face 余额是否确实设计为公开；如果不是，建议减少公共选择字段或收紧数据库视图/RLS。

4. **法律/帮助页可发现性不足**  
   直接访问 `/privacy` 有独立隐私政策；`/terms` 返回“页面不存在”型应用页面，`/help` 返回通用“页面不存在”，主应用页脚也未见隐私/条款链接。需要确认是否另有正式条款 URL，以及隐私政策是否应在登录、上传、充值等关键节点可发现。

5. **标准机器可读入口疑似未配置**  
   本次直接访问 `/robots.txt`、`/sitemap.xml`、`/.well-known/security.txt` 均返回应用 HTML 壳而非对应文本文件，且状态为 200。可能影响搜索/安全报告流程；应确认是否只是 EdgeOne 的 SPA fallback，还是确实缺少这些文件。

6. **安全响应头需要复核**  
   本次 Plaza HTML 响应观察到 EdgeOne、缓存、ETag、Brotli 等头，但未看到 CSP、HSTS、X-Frame-Options、Referrer-Policy 等常见头。单次请求不能证明全站缺失，需用浏览器/不同路由/生产配置再次核验。

7. **HTML 的 Content-Type 未带 charset**  
   原始响应的 `Content-Type` 为 `text/html` 而非 `text/html; charset=utf-8`，虽然文档内有 UTF-8 meta charset，浏览器通常可正确渲染，但部分非浏览器客户端可能先出现编码误判。可作为 SEO/可抓取性待验证项。

8. **“不以盈利为目的”与付费体系并存**  
   指南这样自述，但充值、支付宝、10 Face 代码解锁和 op55 任务托管均已实现。需要在正式条款/产品说明中明确 Face 的性质、退款/支付失败、奖励调整、内容版权和代码仓库责任。

9. **匿名状态下的实际首屏体验仍需浏览器复核**  
   本次可读到动态页面文本和公开 API，但没有登录操作。需要用真实浏览器验证：匿名卡片是否稳定加载封面、悬停预览是否始终被登录门槛拦截、登录回跳是否保留 `?recording=`、移动端瀑布流/详情弹窗是否可用。

## 10. 来源索引

- Plaza：<https://motionface.cc/?view=plaza>
- 首页/分享指南/产品定位：<https://motionface.cc/>
- 我的片段未登录状态：<https://motionface.cc/?view=mine>
- Face 充值与奖励细则：<https://motionface.cc/recharge>
- 隐私政策：<https://motionface.cc/privacy>
- 任务页与成片示例：<https://motionface.cc/op55>、<https://motionface.cc/op55/examples>
- 主前端脚本（路由、UI、API、标签映射、限制）：<https://motionface.cc/assets/index-BaQDJz0T.js>
- 主样式表：<https://motionface.cc/assets/index-DXffe6FT.css>
- 公共数据 REST 服务（由前端脚本配置）：<https://chfjrlcbcmvlqwjesgtr.supabase.co/rest/v1/recordings>
- 公共赞踩统计 RPC：<https://chfjrlcbcmvlqwjesgtr.supabase.co/rest/v1/rpc/get_recording_feedback_v2>
- 本次播放/预览/缩略图验证样本：  
  <https://motionface.cc/api/recordings/2b32f19d-076d-4db6-97bd-b98d4111beff/play>  
  <https://motionface.cc/api/recordings/2b32f19d-076d-4db6-97bd-b98d4111beff/preview>  
  <https://motionface.cc/api/recordings/2b32f19d-076d-4db6-97bd-b98d4111beff/thumbnail>
