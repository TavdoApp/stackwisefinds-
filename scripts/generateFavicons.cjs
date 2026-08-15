const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

// Master SVG design - optimized for high-contrast visibility at 16px, 48px, 96px+
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="110" fill="#141E14"/>
  <rect width="512" height="512" rx="110" stroke="#2C3E2C" stroke-width="12"/>
  <path d="M256 90L70 180L256 270L442 180L256 90Z" fill="#82A735"/>
  <path d="M70 340L256 430L442 340" stroke="#82A735" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M70 260L256 350L442 260" stroke="#82A735" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function generate() {
  console.log('Generating Google-compliant Favicons for StakDock...');

  // 1. Write public/favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgContent, 'utf8');

  const svgBuffer = Buffer.from(svgContent);

  // 2. Generate Google Search standard sizes (48x48, 96x96, 180x180, 192x192, 512x512)
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
    theme_color: "#141E14",
    background_color: "#141E14",
    display: "standalone"
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

  console.log('✅ Generated favicon.svg, favicon-48x48.png, favicon-96x96.png, apple-touch-icon.png, favicon.ico, and site.webmanifest successfully!');
}

generate().catch(console.error);
