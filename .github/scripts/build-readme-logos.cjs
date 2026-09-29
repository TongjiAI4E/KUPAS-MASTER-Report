// Two compact, independent marks using the unchanged original PNG bytes.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const brand = path.join(root, 'website/dist/assets/brand');
const groups = [
  {
    output: 'kupas-mark.svg', width: 144, title: '库帕思 KUPAS',
    logos: [{ file: 'kps_logo.png', x: 12, y: 17.77, width: 120, height: 120 * 510 / 2150 }],
  },
  {
    output: 'tongji-iae-mark.svg', width: 170, title: '同济大学 · 工程智能研究院',
    divider: '<path d="M67 14V50" stroke="#e6ebf2"/>',
    logos: [
      { file: 'tongji_logo.png', x: 8, y: 7, width: 50, height: 50 },
      { file: 'iae_logo.png', x: 78, y: 5.43, width: 84, height: 84 * 854 / 1350 },
    ],
  },
];
const outputDir = path.join(root, '.github/assets');
fs.mkdirSync(outputDir, { recursive: true });
for (const group of groups) {
  const images = group.logos.map(logo => {
    const bytes = fs.readFileSync(path.join(brand, logo.file)).toString('base64');
    return '  <image x="' + logo.x + '" y="' + logo.y + '" width="' + logo.width + '" height="' + logo.height.toFixed(4) + '" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,' + bytes + '"/>';
  });
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + group.width + '" height="64" viewBox="0 0 ' + group.width + ' 64" role="img" aria-labelledby="title">',
    '  <title id="title">' + group.title + '</title>',
    '  <rect width="' + group.width + '" height="64" rx="8" fill="#ffffff"/>',
    group.divider || '',
    ...images,
    '</svg>',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(outputDir, group.output), svg);
  console.log('Created .github/assets/' + group.output);
}
