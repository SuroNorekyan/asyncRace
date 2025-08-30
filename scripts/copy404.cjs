/* eslint-disable no-console */
const { copyFileSync } = require('fs');
const path = require('path');

const from = path.resolve(__dirname, '..', 'dist', 'index.html');
const to = path.resolve(__dirname, '..', 'dist', '404.html');

copyFileSync(from, to);
console.log('Created dist/404.html for GitHub Pages SPA fallback');
