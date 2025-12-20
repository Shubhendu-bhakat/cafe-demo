
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Health Checks...\n');

const checks = {
  'app.js exists': () => fs.existsSync(path.join(__dirname, '../app.js')),
  'package.json exists': () => fs.existsSync(path.join(__dirname, '../package.json')),
  'routes/auth.js exists': () => fs.existsSync(path.join(__dirname, '../routes/auth.js')),
  'routes/booking.js exists': () => fs.existsSync(path.join(__dirname, '../routes/booking.js')),
  'middleware/auth.js exists': () => fs.existsSync(path.join(__dirname, '../middleware/auth.js')),
  'prisma/schema.prisma exists': () => fs.existsSync(path.join(__dirname, '../prisma/schema.prisma')),
};

let passed = 0;
let failed = 0;

Object.entries(checks).forEach(([check, testFn]) => {
  try {
    const result = testFn();
    if (result) {
      console.log(`${check}`);
      passed++;
    } else {
      console.log(` ${check}`);
      failed++;
    }
  } catch (err) {
    console.log(` ${check}: ${err.message}`);
    failed++;
  }
});

console.log(`\n Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}

console.log('✨ All checks passed!');
process.exit(0);
