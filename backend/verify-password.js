const bcrypt = require('bcryptjs');

console.log('🔍 Testing password verification...');

const testPassword = 'Test@123';
const storedHash = '$2a$10$vI8aWY99Qk/d5Zqm4qjvW.bxhyW98CopA2oysmO/YzEGdStVj3C4.';

console.log('🔑 Test Password:', testPassword);
console.log('🔐 Stored Hash:', storedHash);

bcrypt.compare(testPassword, storedHash, (err, result) => {
  if (err) {
    console.error('❌ Error comparing password:', err);
    return;
  }
  
  console.log('✅ Password verification result:', result);
  
  if (result) {
    console.log('🎉 Password matches! Authentication should work.');
  } else {
    console.log('❌ Password does not match! Need to regenerate hash.');
    
    // Generate new hash
    bcrypt.hash(testPassword, 10, (err, newHash) => {
      if (err) {
        console.error('Error generating hash:', err);
        return;
      }
      console.log('🔄 New hash for Test@123:', newHash);
    });
  }
});