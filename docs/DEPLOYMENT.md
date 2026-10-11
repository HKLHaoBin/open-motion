# Open Motion Worker 部署说明

Pages 网站仍作为源码仓库和旧入口；当前正式站点由 Cloudflare Worker 同源提供静态资源、OAuth 和 API。正式入口是 `https://open-motion-api.we3q.workers.dev/`，GitHub Pages 工作流只发布跳转页。这样页面与 Worker 使用同一个 Origin，浏览器不会把会话 Cookie 当作第三方 Cookie。不要把 GitHub Pages 的旧地址当作认证入口，也不要把 Worker assets 目录指向仓库根目录。

## 当前正式部署模式

Worker 的 `worker/site-dist/` 只由 allowlist staging 脚本生成，包含公开页面、脚本、样式和 `assets/`。它不包含 `worker/src/`、`.env`、`.dev.vars`、`.wrangler`、测试或文档。`wrangler.jsonc` 使用 `assets.directory` 和 `ASSETS` binding；API/OAuth 路由先由 Worker 处理，其他公开 GET/HEAD 请求再交给 Static Assets。Worker 同源 GET 在没有 `Origin` header 时只允许请求 URL 的 Origin 与 `ALLOWED_ORIGIN` 完全一致；写请求仍必须通过精确 Origin 校验。

GitHub OAuth App 当前应使用：

```text
Homepage URL:
https://open-motion-api.we3q.workers.dev/

Authorization callback URL:
https://open-motion-api.we3q.workers.dev/auth/callback
```

如果未来拥有自有域名，推荐迁移到同一注册域下的 Pages host 和 Worker API host；迁移后必须同步修改 OAuth callback、Worker vars 和 `config.js`，旧 host-only Cookie 不会迁移。


## 环境文件与密钥处理

`worker/.env` 包含完整的键名、占位值和带注释的中文部署流程。它已被 `.gitignore` 忽略，只能保存在本地。`worker/.env.example` 是可安全参考的模板；`worker/.dev.vars.example` 是 Wrangler 本地开发模板。Wrangler 本地开发读取 `worker/.dev.vars`，不会自动把生产 `.env` 当作 Worker Secret；因此只把本地开发需要的非生产值复制到 `.dev.vars`。Worker 生产静态资源由 allowlist staging 脚本生成，GitHub Pages 只发布跳转页。

不要把真实密钥填入 Pages 工作区或提交到仓库。生产环境使用 Wrangler Secrets 保存 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`SESSION_ENCRYPTION_KEY` 和 `OAUTH_STATE_ENCRYPTION_KEY`；只在 GitHub Actions Secrets 中保存 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。`.env` 中的 KV ID 仅供记录，真实 ID 必须写入 `worker/wrangler.jsonc`。

## 本地开发

1. 安装 Node.js 22 或更高版本。
2. 进入 `worker/` 并安装依赖：

```bash
cd worker
npm ci
```

3. 将 `worker/.dev.vars.example` 复制为 `worker/.dev.vars`，替换本地占位值。HTTP 本地开发允许使用 `COOKIE_SECURE=false`；生产环境必须使用 Secure Cookie。
4. 在项目根目录启动静态站点：

```bash
python -m http.server 4173
```

5. 在 `worker/` 中启动 Worker：

```bash
npx wrangler dev --local --port 8787
```

本地配置应使用：

```env
ALLOWED_ORIGIN=http://localhost:4173
PUBLIC_SITE_URL=http://localhost:4173
OAUTH_CALLBACK_URL=http://localhost:8787/auth/callback
```

如果要进行真实本地 OAuth，GitHub OAuth App 的 callback URL 也必须完全匹配 Worker callback URL，不能填写 Pages 地址。

## 创建 GitHub OAuth App

1. 在 GitHub 创建 OAuth App。
2. Authorization callback URL 填写 Worker 地址，例如：

```text
https://api.example.com/auth/callback
```

3. 这个浏览流程只需要最小的 `read:user` 权限，不默认请求 `write:discussion`。
4. 不要把 Client Secret 写入静态站点或提交到仓库。

## 创建 Cloudflare KV

生产和预览环境应使用独立的 KV 命名空间：

- `OPEN_MOTION_SESSIONS`：保存不透明会话 ID，以及加密后的 GitHub Token。
- `OPEN_MOTION_FEED`：保存最新的、经过清理的公开 Discussions 快照。

在 `worker/` 中执行：

```bash
npx wrangler kv namespace create OPEN_MOTION_SESSIONS
npx wrangler kv namespace create OPEN_MOTION_FEED
npx wrangler kv namespace create OPEN_MOTION_SESSIONS --preview
npx wrangler kv namespace create OPEN_MOTION_FEED --preview
```

将命令输出的生产和预览 ID 填入 [worker/wrangler.jsonc](../worker/wrangler.jsonc)。不要把 KV ID 写入 `config.js` 或 Pages 构建产物。

## 配置生产 Worker

当前同源模式设置以下值：

- `ALLOWED_ORIGIN=https://open-motion-api.we3q.workers.dev`；它必须是 Worker 正式入口的准确 Origin，不带路径和末尾斜杠。
- `PUBLIC_SITE_URL=https://open-motion-api.we3q.workers.dev`；OAuth 成功后回到 Worker 同源页面。
- `OAUTH_CALLBACK_URL=https://open-motion-api.we3q.workers.dev/auth/callback`；必须与 GitHub OAuth App 逐字符一致。
- `COOKIE_SECURE=true`；生产环境不能关闭 Secure Cookie。

如果未来切换到自有域名，Pages 和 Worker 应使用同一个注册域下的两个 host，并同步替换这三个 URL。不要只给 Worker 添加一个与 `github.io` 无关的自定义域名，否则仍然是跨站 Cookie。

## 写入 Cloudflare Secrets

在 `worker/` 中执行以下命令，并按提示输入值。不要把值直接写进命令行，也不要回显值：

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler secret put SESSION_ENCRYPTION_KEY
npx wrangler secret put OAUTH_STATE_ENCRYPTION_KEY
```

`ALLOWED_ORIGIN`、`PUBLIC_SITE_URL` 和 `OAUTH_CALLBACK_URL` 可以通过 Cloudflare 控制台或 Wrangler 环境变量配置。它们不是 OAuth Secret，但也不能被用户输入覆盖。

## 测试并部署 Worker

```bash
npm run check
npm test
npx wrangler deploy
```

部署后用同源请求验证：

```bash
curl -i https://open-motion-api.we3q.workers.dev/api/health
curl -i -H "Origin: https://open-motion-api.we3q.workers.dev" https://open-motion-api.we3q.workers.dev/api/health
```

部署前应确保 `worker/wrangler.jsonc` 中的 KV ID 已经替换，且没有 `replace-with-` 占位值。

## 配置静态资源和 Pages 跳转

[config.js](../config.js) 的 `apiBaseUrl` 必须是同一个 Worker Origin：

```js
apiBaseUrl: "https://open-motion-api.we3q.workers.dev"
```

Worker 的 staging 脚本会把这份公开配置复制到 `worker/site-dist/`。以下内容绝不能出现在 `config.js`、`app.js`、HTML、localStorage、URL、Worker Static Assets 或 Pages artifact 中：

- `GITHUB_CLIENT_SECRET`
- GitHub access token
- `SESSION_ENCRYPTION_KEY`
- `OAUTH_STATE_ENCRYPTION_KEY`
- `.env` 或 `.dev.vars` 内容
- Cloudflare API Token

Pages 工作流只发布跳转页，把旧的 `/open-motion/` 地址引导到 Worker 正式入口；它不再复制应用源码或认证控件。Worker 工作流独立运行 allowlist staging、静态资源扫描、Worker 测试和 `wrangler deploy`。

GitHub Actions 中只需要添加部署所需的：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

这两个值只用于 GitHub Actions，不是 Worker runtime Secret，也不能提交到仓库。Worker runtime Secret 必须通过 Wrangler 或 Cloudflare 控制台配置。

## 推荐部署顺序

1. 创建或确认 GitHub OAuth App，Homepage 和 callback 都指向 Worker 正式入口。
2. 创建生产和预览 KV 命名空间。
3. 将 KV ID 写入 `worker/wrangler.jsonc`，并配置 Worker vars。
4. 通过 Wrangler Secrets 配置四个 Worker runtime Secret。
5. 运行 `npm run stage`、`npm run verify-assets`、Worker 测试和语法检查。
6. 部署 Worker Static Assets 和 API，并验证同源 `/api/health`、`/api/status` 和 OAuth callback。
7. 部署 GitHub Pages 跳转 artifact；Pages 不是正式认证入口。
8. 从 Worker 根地址完成一次 GitHub 登录，并点击“同步最新内容”写入首个 Feed 快照。
9. 配置 GitHub Actions 的 Cloudflare secrets，让后续 Worker 变更可以自动部署。
10. 验证匿名缓存、登录同步、退出登录和 401/403/限流回退。

## 运行时行为

- 匿名 `GET /api/feed` 只读取 Worker 的最后一次成功快照，不会持续消耗 GitHub 匿名 API 配额。没有服务器快照时，浏览器会依次尝试浏览器公开缓存和本地精选作品。
- 登录后，用户点击“同步最新内容”时，`POST /api/feed/latest` 使用 Worker 保存的 Token 请求 GitHub。成功后更新公开快照；遇到 403、429、5xx、超时或网络错误时，返回旧快照并标记为过期；遇到 401 时清除失效会话。
- OAuth state 和 PKCE verifier 加密保存在短期 HttpOnly Cookie 中。GitHub Token 加密保存在 KV 中，浏览器永远不会收到它们。
- 退出登录会删除 KV 会话并清除会话 Cookie。KV 删除具有最终一致性，短会话 TTL 可以限制被窃取 Cookie 的有效时间；如果未来需要强一致撤销，可以迁移到 Durable Objects。
- API 写请求和带 Origin 的请求必须通过精确 Origin 校验；同源 GET/HEAD 在没有 Origin header 时只允许 URL Origin 等于配置 Origin。带凭据的 CORS 绝不使用 `*`。错误响应只返回稳定错误码，不返回 GitHub 原始响应正文或密钥。

## 验证命令

从项目根目录运行：

```bash
node --check app.js
node --check auth.js
node --check submit.js
node --check config.js
```

生成并检查 Worker 静态资源：

```bash
cd worker
npm run stage
npm run verify-assets
npm test
npm run check
```

生产上线前必须验证：

- Worker 根地址能返回 `index.html`，静态资源不返回 Worker JSON 404；
- 同源 GET `/api/status` 和 `/api/feed` 在没有 Origin header 时可以工作；
- 无 Origin 的 POST、OPTIONS、错误 Host 和 `Origin: null` 仍被拒绝；
- OPTIONS/CORS 和错误 Origin 拒绝；
- OAuth state 和 PKCE 不匹配时拒绝；
- Cookie 的 HttpOnly、Secure、SameSite 和 Path 属性，且不包含 Domain；
- 登录、状态查询、退出登录；
- 匿名缓存和首个 Feed 快照；
- 登录后的最新 Discussions 同步；
- GitHub 401、403、429 和 Worker 故障回退；
- 浏览器网络日志和 Static Assets 中没有 Client Secret、Token、授权码或 code_verifier。
