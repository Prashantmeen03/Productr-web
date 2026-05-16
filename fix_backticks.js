const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const files = [
  'LoginPage.jsx', 'SignupPage.jsx', 'OtpLogin.jsx', 'HomePage.jsx',
  'ProductDetails.jsx', 'AddNewProductPage.jsx', 'Profilepage.jsx'
];

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "${API_URL} with `${API_URL}
    // and replace " with ` at the end of the URL string
    // This is a bit tricky because some URLs use template literals correctly elsewhere.
    // We only want to target the ones that look like "${API_URL}/... "
    
    const newContent = content.replace(/"\$\{API_URL\}(.*?)"/g, '`${API_URL}$1`');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log(`Fixed ${file}`);
    }
  }
});
