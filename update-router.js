const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'src/pages/AuthPage.js',
  'src/pages/Shop.js',
  'src/pages/Categories.js',
  'src/pages/Products.js',
  'src/pages/Orders.js',
  'src/pages/Chats.js',
  'src/pages/AddCategory.js',
  'src/pages/EditCategory.js',
  'src/pages/ResetPassword.js',
  'src/components/Layout.js'
];

// Function to update a file
function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import
    content = content.replace(
      /import\s+.*\{\s*useHistory\s*\}\s*from\s+['"]react-router-dom['"]/g,
      `import { useNavigate } from 'react-router-dom'`
    );
    
    // Replace variable declaration
    content = content.replace(
      /const\s+history\s*=\s*useHistory\(\)/g,
      'const navigate = useNavigate()'
    );
    
    // Replace history.push calls
    content = content.replace(
      /history\.push\(/g,
      'navigate('
    );
    
    // Update dependency arrays in useEffect
    content = content.replace(
      /\[\s*(?:[^,\]]*,\s*)*history(?:\s*,\s*[^,\]]*)*\s*\]/g,
      (match) => match.replace('history', 'navigate')
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
