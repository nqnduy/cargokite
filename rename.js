const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Function to remove .html from hrefs inside an HTML content, while retaining the hash
function updateHrefs(content) {
  return content.replace(/href="([^"]+\.html)(#[^"]*)?"/g, (match, p1, p2) => {
    p2 = p2 || "";  // If there's no hash, set p2 to an empty string
    return 'href="' + p1.slice(0, -5) + p2 + '"';
  });
}

fs.readdirSync(distDir).forEach(file => {
  if (path.extname(file) === '.html') {
    const filePath = path.join(distDir, file);
    
    // Read file contents
    const content = fs.readFileSync(filePath, 'utf-8');

    // Update hrefs inside the content
    const updatedContent = updateHrefs(content);

    // Write updated content back to the file
    fs.writeFileSync(filePath, updatedContent);
  }
});
