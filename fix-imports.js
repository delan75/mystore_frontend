const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'src/pages/Categories.js',
  'src/pages/Chats.js',
  'src/pages/EditCategory.js',
  'src/pages/Orders.js',
  'src/pages/Products.js',
  'src/pages/ResetPassword.js'
];

// Function to update a file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import
    content = content.replace(
      /import\s+.*\{\s*useHistory\s*,/g,
      'import { useNavigate,'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Update all files
filesToUpdate.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    updateFile(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('Update complete!');
