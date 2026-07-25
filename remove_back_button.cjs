const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf-8');
code = code.replace(
  /\{\/\* Top Left Reverse \/ Back Button \(\<-\) \*\/\}(.|\n)*?<span className="text-xs font-bold">Back<\/span>\s*<\/button>/m,
  ''
);
fs.writeFileSync('src/components/layout/Navbar.tsx', code);
console.log('Removed back button');
