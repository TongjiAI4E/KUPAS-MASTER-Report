# 仓库检索与内容发现优化

更新日期：2026-09-29。

## 已实施

| 位置 | 优化 | 目的 |
| --- | --- | --- |
| README 首屏 | 中英文项目名称、明确的一句话定位、官网与报告直达链接 | 快速识别项目与可引用来源 |
| 中英文 README | 相同的技术结构、实验数字、FAQ、术语与引用 | 让中文与英文检索均能读取完整正文 |
| About / Description | 品牌名 + experience engineering + AI agents + 具体资产与报告范围 | 提升仓库简介的信息密度 |
| GitHub Topics | 17 个相关主题，配置见 `../.github/repository-metadata.json` | 支持主题浏览与 GitHub 检索 |
| 实验说明 | 数字表、图表、JSON 与 PDF 来源互链 | 让检索结果可以核对结论与统计范围 |
| `CITATION.cff` 与 BibTeX | 团队署名、报告标题、机构、年份与稳定网址 | 便于规范引用和提取书目信息 |
| 网页 head | canonical、description、robots、Open Graph、Twitter Card、JSON-LD | 明确规范网址、内容身份与分享摘要 |
| `sitemap.xml` | 主页及双语 PDF 的完整公开链接 | 提供可提交给搜索引擎的 URL 清单 |
| `llms.txt` | 简短项目介绍、结果口径与权威来源索引 | 为主动读取该文件的工具提供便利 |

关键词围绕报告已有内容自然分布：经验工程 / experience engineering、隐性知识 / tacit knowledge、专家经验 / expert knowledge、知识获取 / knowledge acquisition、经验语料 / experience corpora、组织知识 / organizational knowledge、LLM agents、agent skills、retrieval-augmented generation / RAG、AI for engineering。不加入与本仓库无关的模型名、框架名或“开放权重”等标签。

## 当前 Trending 参考

2026-09-29 直接读取 GitHub Trending 当日榜单，并检查其中三个相关项目的 README：

- [NVIDIA/OpenShell](https://github.com/NVIDIA/OpenShell)：明确定位、原理概述、快速入口及进一步阅读。
- [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)：项目入口集中展示、效果证据、核心概念与应用说明。
- [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex)：名称与技术定位结合、可视化框架、方法对比及实验结果。

本项目借鉴其内容组织方式，使用自身的技术内容、机构信息与实验依据。

## 检索效果的边界

- 这些修改改善内容可发现性、可理解性与可引用性，不保证任何搜索引擎或联网大模型收录、排名或引用。
- Google 对 AI 搜索功能仍采用基础搜索要求：可抓取、可索引、重要内容以文本呈现、结构化数据与正文一致；不要求额外的 AI 文本文件或专用 schema。
- `llms.txt` 是附加阅读索引，不视为已被所有大模型支持的标准，也不作为已证实的排名信号。
- 不使用 `meta keywords` 堆词；Google 明确不将其用于索引与排名。研究关键词放在实际正文、仓库简介与 Topics 中。
- 本站是 GitHub Pages 的项目子路径。有效的 `robots.txt` 应在域名根目录 `https://tongjiai4e.github.io/robots.txt`，当前仓库不能通过子路径的同名文件控制全域爬虫策略。
- 网页通过 JavaScript 切换语言，因此独立的英文 Markdown README 与英文 PDF 也作为无需脚本的英文内容入口。
- 未擅自增加许可证、DOI、arXiv 编号、模型下载入口或不在报告内的效果声称。

## 后续可继续提高发现概率

1. 从现有产品官网、机构项目页或正式发布材料链接到这个仓库和 Pages 主页，建立可核验的关联。
2. 由站点所有者在 Google Search Console / Bing Webmaster Tools 验证站点并提交 `sitemap.xml`，观察实际收录及来源流量。
3. 报告迭代时发布真实版本说明，保持 PDF、README、图表和引用信息同步；如取得 DOI 或公开预印本编号，再补充这些稳定标识。
4. 如需更充分的多语言网页索引，可进一步生成独立、预渲染的英文 HTML 路径，并配套正确的 hreflang。

## 官方依据

- [GitHub：使用 Topics 分类仓库](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics)
- [Google：AI 搜索功能与网站](https://developers.google.com/search/docs/appearance/ai-features)
- [Google：支持与不支持的 meta 标签](https://developers.google.com/search/docs/crawling-indexing/special-tags)
- [GitHub：使用自定义工作流部署 Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
