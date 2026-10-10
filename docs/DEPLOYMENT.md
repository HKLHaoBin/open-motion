# Open Motion Worker 部署说明

Pages 网站是静态站点；OAuth 和 GitHub API 访问全部由 Cloudflare Worker 负责。下面列出的 Worker 密钥绝不能写入 `config.js`、`app.js`、Pages 构建产物、浏览器存储、URL 或日志。

## 环境文件与密钥处理

`worker/.env` 包含完整的键名、占位值和带注释的中文部署流程。它已被 `.gitignore` 忽略，只能保存在本地。`worker/.env.example` 是可安全参考的模板；`worker/.dev.vars.example` 是 Wrangler 本地开发模板。Wrangler 本地开发读取 `worker/.dev.vars`，不会自动读取 `.env`，因此只把本地开发需要的非生产值复制到 `.dev.vars`。

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

设置以下值：

- `ALLOWED_ORIGIN`：准确的 Pages Origin，例如 `https://owner.github.io`，不要带末尾斜杠。
- `PUBLIC_SITE_URL`：Pages 地址；如果是项目 Pages，需要包含项目路径，例如 `https://owner.github.io/open-motion`。
- `OAUTH_CALLBACK_URL`：Worker callback 地址，例如 `https://api.example.com/auth/callback`。
- `COOKIE_SECURE=true`，或者在生产环境删除这个变量。

建议使用长且随机的加密密钥。尽可能让 Pages 自定义域名和 Worker API 子域名处于同一个注册域名下。如果 Pages 使用 `github.io`、Worker 使用 `workers.dev`，Cookie 属于跨站 Cookie，需要 `SameSite=None; Secure`，并应在 Chrome、Safari 和 Firefox 中分别验证，因为浏览器隐私设置可能阻止第三方 Cookie。

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

部署后用正确的 Origin 验证：

```bash
curl -i -H "Origin: https://owner.github.io" https://api.example.com/api/health
```

部署前应确保 `worker/wrangler.jsonc` 中的 KV ID 已经替换，且没有 `replace-with-` 占位值。

## 配置静态站点和 Pages

将 [config.js](../config.js) 中的 `apiBaseUrl` 设置为公开的 Worker Origin，例如：

```js
apiBaseUrl: "https://api.example.com"
```

这个地址不是密钥，可以出现在 Pages。以下内容绝不能出现在 `config.js`、`app.js`、HTML、localStorage、URL 或 Pages 构建产物中：

- `GITHUB_CLIENT_SECRET`
- GitHub access token
- `SESSION_ENCRYPTION_KEY`
- `OAUTH_STATE_ENCRYPTION_KEY`
- `.env` 或 `.dev.vars` 内容
- Cloudflare API Token

Pages 工作流只复制静态资源。Worker 工作流独立部署 `worker/`，不会把 Worker 密钥复制到 Pages。

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中添加：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

这两个值只用于 GitHub Actions，不是 Worker runtime 变量，也不能提交到仓库。

## 推荐部署顺序

1. 创建 GitHub OAuth App。
2. 创建生产和预览 KV 命名空间。
3. 填写 `worker/wrangler.jsonc` 中的 KV ID。
4. 配置 Worker 环境变量和 Secrets。
5. 运行 Worker 测试并部署 Worker。
6. 用 `/api/health`、`/api/status` 和 CORS 预检验证 Worker。
7. 在 `config.js` 填写 `apiBaseUrl`。
8. 部署 GitHub Pages。
9. 向 `OPEN_MOTION_FEED` 写入首个公开快照。
10. 验证匿名浏览、GitHub 登录、最新同步、退出登录和错误回退。

## 运行时行为

- 匿名 `GET /api/feed` 只读取 Worker 的最后一次成功快照，不会持续消耗 GitHub 匿名 API 配额。没有服务器快照时，浏览器会依次尝试浏览器公开缓存和本地精选作品。
- 登录后，用户点击“同步最新内容”时，`POST /api/feed/latest` 使用 Worker 保存的 Token 请求 GitHub。成功后更新公开快照；遇到 403、429、5xx、超时或网络错误时，返回旧快照并标记为过期；遇到 401 时清除失效会话。
- OAuth state 和 PKCE verifier 加密保存在短期 HttpOnly Cookie 中。GitHub Token 加密保存在 KV 中，浏览器永远不会收到它们。
- 退出登录会删除 KV 会话并清除会话 Cookie。KV 删除具有最终一致性，短会话 TTL 可以限制被窃取 Cookie 的有效时间；如果未来需要强一致撤销，可以迁移到 Durable Objects。
- 所有 API 响应都校验配置的 Origin。带凭据的 CORS 绝不使用 `*`。错误响应只返回稳定错误码，不返回 GitHub 原始响应正文或密钥。

## 验证命令

从项目根目录运行：

```bash
node --check app.js
node --check auth.js
node --check submit.js
node --check config.js
```

运行不需要真实 GitHub 或 Cloudflare 凭据的 Worker 模拟测试：

```bash
cd worker
npm test
```

生产上线前必须验证：

- OPTIONS/CORS 和错误 Origin 拒绝；
- OAuth state 和 PKCE 不匹配时拒绝；
- Cookie 的 HttpOnly、Secure、SameSite 和 Path 属性；
- 登录、状态查询、退出登录；
- 匿名缓存和浏览器缓存回退；
- 登录后的最新 Discussions 同步；
- GitHub 401、403、429 和 Worker 故障回退；
- 浏览器网络日志中没有 Client Secret、Token、授权码或 code_verifier。
