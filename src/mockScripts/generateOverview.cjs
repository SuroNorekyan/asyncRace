const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../..', 'src');
const outputFile = path.join(__dirname, 'project_overview.txt');

function walk(dir, fileList = []) {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function generate() {
  const files = walk(targetDir);
  let output = '';

  for (const file of files) {
    const relativePath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf-8');

    output += `${relativePath}\n`;
    output += '----------------------------------------\n';
    output += content + '\n\n';
  }

  fs.writeFileSync(outputFile, output, 'utf-8');
  console.log(`✅ Overview created at: ${outputFile}`);
}

generate();
