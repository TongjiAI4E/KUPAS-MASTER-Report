# 老师傅 KUPAS MASTER 技术报告主页

基于提供的 2026 年 9 月中英文技术报告制作的双语静态主页。

- 网页入口：`website/dist/index.html`
- 部署目录：`website/dist/`，可整体放到任意静态网站服务器或 GitHub Pages。
- 无构建步骤、无 CDN、无外部字体、无后端依赖；两份报告随站点提供。
- 本项目未发布到线上，也未更改老师傅现有官网。

## 本地查看

直接打开 `website/dist/index.html`，或从项目根目录启动：

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory website/dist
```

浏览器访问 `http://127.0.0.1:4173/`。`?lang=zh` 与 `?lang=en` 可直达指定语言，语言偏好仅保存在当前浏览器。

## 内容与交互

产品体验入口、官网登录页视觉、页眉同一行右侧的三个机构标志、平台概览、独立产品框架、九层认知语料化说明、七步经验工程流程、三组实验图文轮播、调解案例、中英文报告分别下载、部署概述。

三张完整实验卡片排列在同一条轨道上，支持鼠标按住拖动、手机跟手滑动、左右按钮、分页和键盘切换，图表仍可点击放大。两侧直接露出真实相邻卡片，仅覆盖轻微磨砂；点击露出部分可选中该卡片。松手后自动吸附，第一张左侧和最后一张右侧留空，不循环。图表中英文同步切换，采用统一配色和零起点坐标。支持移动导航、减少动画偏好，以及关闭 JavaScript 时的中文正文与报告下载。

平台概览采用数字与标题同排的版式，数字用蓝色区分；概览介绍使用“老师傅平台”，英文同步。经验工程的七个编号略微放大；评测范围、评分方式与运行开销展开模块已移除。

## 修改位置

| 文件 | 用途 |
| --- | --- |
| `website/dist/index.html` | 静态内容；中文写在标签中，英文写在 `data-en` 属性中 |
| `website/dist/styles.css` | 参考 Apple 产品页的白色与浅灰版式、大标题、圆角卡片、蓝色交互及响应式布局 |
| `website/dist/app.js` | 九层中英文说明、语言切换、轮播与图片放大、键盘和导航行为 |
| `website/dist/assets/results/` | 六张双语 SVG、图表数值和报告原图 PDF |
| `website/dist/assets/brand/master-transparent.png` | 1254 × 1254 RGBA 透明主体图；所有标题、宣传语均为独立 HTML |
| `website/HERO-ASSET.md` | 内置 imagegen 生成方式、完整提示词和素材说明 |
| `website/scripts/build-results.cjs` | 从保留的原始数值重建统一风格的双语图表 |
| `website/dist/assets/reports/` | 未修改的中英文 PDF |
| `website/SOURCES.md` | 文字、数字和视觉参考的来源与统计边界 |
| `website/scripts/verify.cjs` | 使用 Playwright 的交互、布局、下载与源文件一致性校验 |

更换报告时，请同步标题、页数、文件大小、预览图、评测数据和来源说明。九层说明中的输出是待审核的候选经验，不应把整体评测结果表述为每条抽取算法的独立验证。

## 重做前的备份与回退

完整旧版保存在 `backups/KUPAS-MASTER-before-apple-20260929-164337.zip`。备份在本轮代码修改之前制作，包含 29 个文件和 SHA-256 清单，并通过 ZIP 与逐文件校验。

需要回退时，将备份中的 `website/`、`README.md` 和 `.gitignore` 恢复到项目目录。备份中的页面、原始图表、机构标志及两份技术报告可独立运行。

当前版本将首屏宣传语和主体图分开，文字可选择、翻译和响应式排版。首屏图片为非交互展示，不提供点击放大；产品体验下方的中英文技术报告分别以按钮下载。产品体验与下载按钮不带装饰箭头，导航文字加粗；页脚在库帕思标志右侧加入工程智能研究院标志。实验切换按钮和框架流程使用统一的空心 SVG 箭头。实验图表仍支持放大查看。

## English

A static bilingual introduction to the KUPAS MASTER technical report. Serve `website/dist/` with any static host; no build step is required. The page includes interactive explanations of the nine extraction dimensions, the seven-step workflow, source-backed evaluation charts, a recorded case study, and both original PDF reports. Add `?lang=en` for English. No online deployment has been made.
