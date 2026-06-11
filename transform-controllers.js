const fs = require('fs');
const path = require('path');

const dir = 'E:/Web-Masjid/backend/src/controllers';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // Remove model imports
  content = content.replace(/const\s+\{[\s\w,]+\}\s*=\s*require\('\.\.\/models'\);/g, '');
  
  // Add db import after first require line
  const lines = content.split(/\r?\n/);
  let insertIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(
equire()) {
      insertIdx = i + 1;
      break;
    }
  }
  
  if (insertIdx > 0) {
    lines.splice(insertIdx, 0, const db = require('../supabase'););
    content = lines.join('\n');
  }
  
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Updated: ' + file);
});

console.log('All controllers updated');
