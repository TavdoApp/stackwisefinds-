const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

// Master Original StakDock Light Sage Brand SVG (High-contrast, crisp at all sizes)
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#EBF0E1"/>
  <rect width="512" height="512" rx="128" stroke="#E2E6D8" stroke-width="12"/>
  <path d="M256 95L75 178L256 262L437 178L256 95Z" fill="#82A735"/>
  <path d="M75 335L256 420L437 335" stroke="#82A735" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M75 255L256 340L437 255" stroke="#82A735" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function generate() {
  console.log('Generating Original Light Sage Brand Favicons for StakDock...');

  // 1. Write public/favicon.svg and public/logo.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent, 'utf8');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate Google Search Central standard sizes (48x48, 96x96, 180x180, 192x192, 512x512)
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon-48x48.png'));
  await sharp(svgBuffer).resize(96, 96).png().toFile(path.join(publicDir, 'favicon-96x96.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'favicon-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'favicon-512x512.png'));

  // 3. Generate standard favicon.ico (48x48)
  const icoPngBuffer = await sharp(svgBuffer).resize(48, 48).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoPngBuffer);

  // 4. Create site.webmanifest
  const manifest = {
    name: "StakDock",
    short_name: "StakDock",
    icons: [
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    theme_color: "#82A735",
    background_color: "#EBF0E1",
    display: "standalone"
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log('✅ Generated original Light Sage favicon suite successfully!');
}

generate().catch(console.error);
