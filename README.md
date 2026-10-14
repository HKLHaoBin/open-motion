# Open Motion

## 项目简介

Open Motion 是一个由 GitHub Discussions 驱动的开源动效社区，用于发现、分享和复用可运行的动效作品。项目包含静态前端与 Cloudflare Worker 后端：前端展示作品和提交入口，Worker 提供 GitHub OAuth、讨论内容同步、会话管理与缓存能力。

正式站点：[open-motion-api.we3q.workers.dev](https://open-motion-api.we3q.workers.dev/)

## 安装步骤

- 安装 [Node.js 22](https://nodejs.org/) 或更高版本。
- 克隆仓库并进入项目目录：

  ```bash
  git clone https://github.com/HKLHaoBin/open-motion.git
  cd open-motion
  ```

- 安装 Worker 依赖：

  ```bash
  cd worker
  npm ci
  cd ..
  ```

- 创建本地 Worker 配置文件：

  ```bash
  cp worker/.dev.vars.example worker/.dev.vars
  ```

- 根据本地环境替换 `worker/.dev.vars` 中的占位值。生产环境的密钥应使用 Wrangler Secrets 配置，不要提交到仓库。

## 基本用法

启动本地静态站点和 Cloudflare Worker：

```bash
# 终端一：在项目根目录启动静态前端
python -m http.server 4173

# 终端二：启动 Worker
cd worker
npx wrangler dev --local --port 8787
```

执行 Worker 测试与语法检查：

```bash
cd worker
npm test
npm run check
```

构建并校验 Worker 的公开静态资源：

```bash
cd worker
npm run stage
npm run verify-assets
```

部署 Worker 前，请先配置 Cloudflare KV、GitHub OAuth 参数和 Wrangler Secrets，具体步骤参见 [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)。

## 许可证

项目代码采用 [MIT License](https://opensource.org/license/mit)。字体、音频、图片、视频及其他第三方素材不自动继承项目代码许可证，使用时请遵循其来源仓库、GitHub Discussion 或素材本身注明的授权条款。
