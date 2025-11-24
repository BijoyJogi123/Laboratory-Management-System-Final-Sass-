const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('Generating password hashes...\n');
  
  const passwords = [
    { label: 'admin123', password: 'admin123' },
    { label: 'Test@123', password: 'Test@123' }
  ];
  
  for (const item of passwords) {
    const hash = await bcrypt.hash(item.password, 10);
    console.log(`Password: ${item.label}`);
    console.log(`Hash: ${hash}`);
    console.log('');
  }
}

generateHashes();
