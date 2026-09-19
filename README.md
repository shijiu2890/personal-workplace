# 我的工作台 · 随身版（personal-workplace）

自己用的随身工作台，**不依赖任何服务器**：数据存在浏览器本地（localStorage），断网也能记。

线上地址：<https://shijiu2890.github.io/personal-workplace/>

## 它是什么

- 单个静态页面（`index.html`，自带样式和逻辑，无框架无依赖）
- 功能：今日任务（勾选/新增/改名/删除）、8 个区域卡片 + 每个区域的本地笔记、随手记、链接收藏、导出/导入 .md
- 手机浏览器打开后可「添加到主屏幕 / 安装应用」，全屏像 App
- 有 Service Worker：**网络优先**（能联网取最新版，断网退回缓存）—— 故意不用缓存优先，避免"改了代码还看旧版"

## 跟电脑上那个工作台的关系

| | 这个（随身版） | 电脑上的工作台 |
|---|---|---|
| 数据在哪 | 浏览器本地 | 电脑里的 .md 文件（`d:\workplace\我的工作台\`） |
| 需要电脑开机 | 不需要 | 需要 |
| 两边同步 | 手动「导出 / 导入 .md」 | 手动 |

两者是**独立的两份数据**，互不覆盖。

## 怎么改

1. 改 `index.html`（界面和逻辑都在里面）
2. 提交并推送：`git add -A && git commit -m "改了什么" && git push`
3. GitHub Pages 会自动重建，约 1 分钟后手机刷新即可看到
   - 如果改了前端想立刻看到效果：手机清一次缓存，或等 SW 自动更新（网络优先，通常一两次刷新就换新）

### ⚠️ 这台电脑的网络对 github.com 时通时断

`git push` 可能会失败（`Failed to connect to github.com:443` / `Empty reply from server`）。
这时改用 API 通道（只走 api.github.com，比较稳）：

```
cd d:\workplace\我的工作台
python tools\gh_upload.py "d:\workplace\personal-workplace" shijiu2890/personal-workplace main "改了什么"
```

它会把文件夹里的文件逐个用 GitHub Contents API 上传（已存在的文件会自动带上 sha 更新）。


## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 整个应用（界面 + 逻辑） |
| `manifest.webmanifest` | 让手机能"添加到主屏幕/安装应用" |
| `sw.js` | 离线缓存（网络优先） |
| `icons/` | 应用图标（由 `d:\workplace\我的工作台\tools\make_icon.py` 生成） |
| `.nojekyll` | 告诉 GitHub Pages 不要用 Jekyll 处理 |
