// Arrange the original logos without redrawing, cropping, or recoloring them.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const brand = path.join(root, 'website/dist/assets/brand');
const logos = [
  { file: 'kps_logo.png', name: '库帕思 KUPAS', x: 49, y: 53, width: 232, height: 232 * 510 / 2150 },
  { file: 'tongji_logo.png', name: '同济大学 Tongji University', x: 346, y: 32, width: 96, height: 96 },
  { file: 'iae_logo.png', name: '工程智能研究院 Institute of AI for Engineering', x: 520, y: 27, width: 172, height: 172 * 854 / 1350 },
];
const images = logos.map(logo => {
  const bytes = fs.readFileSync(path.join(brand, logo.file)).toString('base64');
  return '  <image x="' + logo.x + '" y="' + logo.y + '" width="' + logo.width + '" height="' + logo.height.toFixed(4) + '" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,' + bytes + '"><title>' + logo.name + '</title></image>';
});
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="760" height="160" viewBox="0 0 760 160" role="img" aria-labelledby="title description">',
  '  <title id="title">KUPAS · Tongji University · Institute of AI for Engineering</title>',
  '  <desc id="description">库帕思、同济大学、工程智能研究院。原始机构标志在统一白色底板上等比排列。</desc>',
  '  <rect x="0.75" y="0.75" width="758.5" height="158.5" rx="20" fill="#ffffff" stroke="#dce4ee" stroke-width="1.5"/>',
  '  <path d="M312 46V114M480 46V114" stroke="#e6ebf2" stroke-width="1"/>',
  ...images,
  '</svg>',
  '',
].join('\n');
const output = path.join(root, '.github/assets/brand-header.svg');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, svg);
console.log('Created .github/assets/brand-header.svg with three unchanged embedded PNGs.');
