const bcrypt = require('bcryptjs');

console.log('Generating password hash for Test@123...');

bcrypt.hash('Test@123', 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('Password: Test@123');
  console.log('Hash:', hash);
  
  // Test the hash
  bcrypt.compare('Test@123', hash, (err, result) => {
    if (err) {
      console.error('Compare error:', err);
      return;
    }
    console.log('Hash verification:', result ? 'SUCCESS' : 'FAILED');
  });
});