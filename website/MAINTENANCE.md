# 网站维护与部署

## 本地预览

从仓库根目录运行：

```bash
python -m http.server 4173 --bind 127.0.0.1 --directory website/dist
```

网页入口为 `website/dist/index.html`，无需构建。`?lang=zh` 与 `?lang=en` 可选择语言。

## 修改位置

| 文件 | 用途 |
| --- | --- |
| `dist/index.html` | 中文正文、`data-en` 英文翻译、页面元信息与 JSON-LD |
| `dist/styles.css` | 页面布局与响应式样式 |
| `dist/app.js` | 语言切换、九层说明、轮播、放大与导航行为 |
| `dist/assets/results/results-data.json` | 图表汇总数据及来源 |
| `scripts/build-results.cjs` | 根据汇总数据生成双语 SVG |
| `dist/assets/reports/` | 两份完整报告 |
| `dist/llms.txt` | 面向工具读取的简短内容与来源索引 |
| `dist/sitemap.xml` | 主页及报告的公开地址 |
| `../README.md`、`../README.en.md` | 面向读者与检索系统的中英文项目介绍 |

更换报告时，同步两版 README、引用信息、页数、预览图、评测数据和 `SOURCES.md`。统计分数采用从业者等权口径，增量单位为分。

## GitHub Pages

- 网站：https://tongjiai4e.github.io/KUPAS-MASTER-Report/
- 工作流：`../.github/workflows/pages.yml`。
- Pages 的发布方式为 GitHub Actions，部署目录仅为 `website/dist/`。
- 推送该目录或工作流的修改到 `main` 后自动部署，也可在 Actions 中手动运行。
- README 的独立修改无需重新部署网页。
- 克隆到另一个仓库时，需同步修改 README、引用、canonical、Open Graph、JSON-LD、站点地图及 `llms.txt` 中的公开域名和仓库路径，并在该仓库启用 Pages。

## 验证

`scripts/verify.cjs` 使用 Playwright。先启动本地服务器，安装 Playwright 或设置 `NODE_PATH` 指向已有依赖，然后运行：

```bash
node website/scripts/verify.cjs
```

可通过 `KUPAS_PREVIEW_URL` 指定已部署网址（需以 `/` 结尾），通过 `KUPAS_BROWSER` 指定 Chromium/Chrome 可执行文件。检查覆盖中英文交互、六种视口宽度、图表轮播、无 JavaScript 内容及两份 PDF 的下载字节。记录写入被 Git 忽略的 `website/.qa/`。

## 来源与视觉资产

内容依据见 [SOURCES.md](SOURCES.md)，视觉资产来源见 [HERO-ASSET.md](HERO-ASSET.md)，交付核验见 [VERIFICATION.md](VERIFICATION.md)。

仓库简介、Topics、搜索与联网检索优化的依据及后续建议见 [DISCOVERABILITY.md](DISCOVERABILITY.md)。

本地 `backups/`、`.work/` 和 `.qa/` 是维护记录，不属于线上部署目录。早期视觉版本的回退备份保留在本地 `backups/` 中；公开仓库的后续版本通过 Git 历史追踪。

## README 机构标志

中英文 README 在人物图下方、项目介绍上方展示两组小标志：`../.github/assets/kupas-mark.svg` 为独立库帕思标志（144 × 64），`../.github/assets/tongji-iae-mark.svg` 组合了同济大学和工程智能研究院（170 × 64）。两组分别使用白色底板，适配 GitHub 深浅主题。SVG 内嵌的是 `dist/assets/brand/` 中原始 PNG 的完整字节，仅进行等比排版。

替换原始标志后，从仓库根目录运行 `node .github/scripts/build-readme-logos.cjs` 重建两组标志。顶部居中布局参考 [Dify](https://github.com/langgenius/dify) 和 [vLLM](https://github.com/vllm-project/vllm) 的 README。
