#!/usr/bin/env node
/**
 * Helper script to decode base64 images for the Pro screen
 * 
 * Usage:
 * 1. Save the "before" base64 string to: scripts/before.b64
 * 2. Save the "after" base64 string to: scripts/after.b64
 * 3. Run: node scripts/decode_images.js
 * 
 * The decoded PNG files will be saved to assets/images/
 */

const fs = require('fs');
const path = require('path');

const scriptDir = __dirname;
const assetsDir = path.join(scriptDir, '..', 'assets', 'images');

function decodeBase64Image(inputFile, outputFile) {
  try {
    let b64 = fs.readFileSync(inputFile, 'utf8').trim();
    // Remove data URI prefix if present
    const commaIdx = b64.indexOf(',');
    if (b64.startsWith('data:') && commaIdx !== -1) {
      b64 = b64.substring(commaIdx + 1);
    }
    // Remove whitespace
    b64 = b64.replace(/\s+/g, '');
    // Pad if needed
    const mod4 = b64.length % 4;
    if (mod4 !== 0) b64 += '='.repeat(4 - mod4);
    
    const buffer = Buffer.from(b64, 'base64');
    fs.writeFileSync(outputFile, buffer);
    console.log(`✅ Saved: ${outputFile} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`❌ Error processing ${inputFile}:`, err.message);
  }
}

const beforeInput = path.join(scriptDir, 'before.b64');
const afterInput = path.join(scriptDir, 'after.b64');
const beforeOutput = path.join(assetsDir, 'before_plantus.png');
const afterOutput = path.join(assetsDir, 'after_plantus.png');

if (!fs.existsSync(beforeInput)) {
  console.log(`⚠️  Missing: ${beforeInput}`);
  console.log('   Please save the "before" base64 string to this file.');
}
if (!fs.existsSync(afterInput)) {
  console.log(`⚠️  Missing: ${afterInput}`);
  console.log('   Please save the "after" base64 string to this file.');
}

if (fs.existsSync(beforeInput)) {
  decodeBase64Image(beforeInput, beforeOutput);
}
if (fs.existsSync(afterInput)) {
  decodeBase64Image(afterInput, afterOutput);
}

console.log('\nDone!');
