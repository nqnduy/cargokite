const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle custom routes to remove .html extension
app.get('/:page', (req, res) => {
  const page = req.params.page;  
  console.log(req.params)
  if (page.endsWith('.html')) {
    const pageWithoutExtension = page.slice(0, -5); // Remove the .html extension
    res.redirect(`/${pageWithoutExtension}`);
  } else {
    res.sendFile(path.join(__dirname, 'dist', page + '.html'));
  }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});