'use strict';

const fs = require('fs');
const path = require('path');

const source = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'unit11-source.json'), 'utf8')
);

function esc(s) {
    return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function toLine(item) {
    const syns = item.syns.map((s) => `'${esc(s)}'`).join(', ');
    const w = item.w.charAt(0).toUpperCase() + item.w.slice(1);
    return `            {u:'${item.u}', w:'${esc(w)}', p:'${esc(item.p)}', pos:'${esc(item.pos)}', def:'${esc(item.def)}', ex:'${esc(item.ex)}', syns:[${syns}]}`;
}

const seen = new Set();
const unique = [];
for (const item of source) {
    const key = item.w.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
}

const block =
    '\n            // UNIT 11: TECHNOLOGY AND INNOVATION\n' + unique.map(toLine).join(',\n');

const dataPath = path.join(__dirname, '..', 'js', 'data.js');
let data = fs.readFileSync(dataPath, 'utf8');

if (data.includes('// UNIT 11:')) {
    console.log('Unit 11 already present in data.js');
    process.exit(0);
}

const marker = "{u:'10', w:'Satellites'";
const idx = data.lastIndexOf(marker);
if (idx < 0) {
    console.error('Could not find Unit 10 Satellites entry');
    process.exit(1);
}

const closeIdx = data.indexOf('\n        ];', idx);
if (closeIdx < 0) {
    console.error('Could not find array close');
    process.exit(1);
}

const updated = data.slice(0, closeIdx) + ',' + block + data.slice(closeIdx);
fs.writeFileSync(dataPath, updated);
console.log(`Added ${unique.length} words to Unit 11 in data.js`);
