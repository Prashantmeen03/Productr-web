const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = [
  'SignupPage.jsx', 'Profilepage.jsx', 'ProductsPage.jsx', 
  'ProductDetails.jsx', 'OtpLogin.jsx', 'LoginPage.jsx', 
  'HomePage.jsx', 'ErrorPage.jsx', 'AddNewProductPage.jsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Check if it has logo
    if (content.includes('"/img/logo.svg"')) {
      if (!content.includes('import logoImg from')) {
        content = 'import logoImg from "./assets/img/logo.svg";\n' + content;
      }
      content = content.replace(/"\/img\/logo\.svg"/g, '{logoImg}');
      changed = true;
    }

    // Check if it has login bg
    if (content.includes('"img/login.png"')) {
      if (!content.includes('import loginBg from')) {
        content = 'import loginBg from "./assets/img/login.png";\n' + content;
      }
      content = content.replace(/"img\/login\.png"/g, '{loginBg}');
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed', file);
    }
  }
});
