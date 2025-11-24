const bcrypt = require('bcryptjs');

const hash = '$2a$10$vI8aWY99Qk/d5Zqm4qjvW.bxhyW98CopA2oysmO/YzEGdStVj3C4.';

async function verify() {
  const passwords = ['admin123', 'Test@123', 'test123', 'Admin@123'];
  
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, hash);
    if (match) {
      console.log(`✅ MATCH FOUND: "${pwd}"`);
    } else {
      console.log(`❌ No match: "${pwd}"`);
    }
  }
}

verify().catch(console.error);
