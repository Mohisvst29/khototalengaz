const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = getAllFiles(srcDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lucideImports = content.match(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/g);
  if (lucideImports) {
    lucideImports.forEach(imp => {
      const iconsMatch = imp.match(/\{([^}]+)\}/);
      if (iconsMatch) {
        const icons = iconsMatch[1].split(',').map(i => i.trim().split(' as ')[0].trim());
        icons.forEach(icon => {
          if (icon && !lucide[icon]) {
            console.log(`FILE: ${file} | MISSING: ${icon}`);
          }
        });
      }
    });
  }
});
