const bcrypt = require('bcryptjs');

async function createAndVerifyPassword() {
  const password = 'Test@123';
  
  console.log('🔑 Creating hash for password:', password);
  
  // Create hash
  const hash = await bcrypt.hash(password, 10);
  console.log('🔐 Generated hash:', hash);
  
  // Verify hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Hash verification:', isValid ? 'SUCCESS' : 'FAILED');
  
  // Test with existing hash
  const existingHash = '$2a$10$vI8aWY99Qk/d5Zqm4qjvW.bxhyW98CopA2oysmO/YzEGdStVj3C4.';
  const isExistingValid = await bcrypt.compare(password, existingHash);
  console.log('🔍 Existing hash verification:', isExistingValid ? 'SUCCESS' : 'FAILED');
  
  return hash;
}

createAndVerifyPassword();