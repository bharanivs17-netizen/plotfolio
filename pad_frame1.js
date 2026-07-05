const sharp = require('sharp');
const path = require('path');

async function padFrame1() {
  const inputPath = 'd:\\plotfolio\\image_frame\\ezgif-frame-001.jpg';
  const outputPath = 'd:\\plotfolio\\image_frame\\frame-0001-padded.png';

  try {
    const meta = await sharp(inputPath).metadata();
    const maxDim = Math.max(meta.width, meta.height);

    console.log(`Original dimensions: ${meta.width}x${meta.height}. Padding to ${maxDim}x${maxDim}...`);

    await sharp(inputPath)
      .extend({
        top: Math.floor((maxDim - meta.height) / 2),
        bottom: Math.ceil((maxDim - meta.height) / 2),
        left: 0,
        right: 0,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      })
      .toFile(outputPath);

    console.log('Padded image saved to:', outputPath);
  } catch (err) {
    console.error('Error padding image:', err);
  }
}

padFrame1();
