const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Frontend Pages Setup...\n');

const pages = [
  { name: 'Dashboard', path: 'laboratory/src/pages/DashboardNew.js', route: '/dashboard' },
  { name: 'Invoice List', path: 'laboratory/src/pages/billing/InvoiceList.js', route: '/billing' },
  { name: 'EMI Management', path: 'laboratory/src/pages/billing/EMIManagement.js', route: '/emi' },
  { name: 'Party Ledger', path: 'laboratory/src/pages/ledger/PartyLedger.js', route: '/ledger' },
  { name: 'Inventory List', path: 'laboratory/src/pages/inventory/InventoryList.js', route: '/inventory' },
  { name: 'Doctor List', path: 'laboratory/src/pages/doctors/DoctorList.js', route: '/doctors' },
  { name: 'Package List', path: 'laboratory/src/pages/packages/PackageList.js', route: '/packages' },
  { name: 'Reports List', path: 'laboratory/src/pages/reports/ReportsList.js', route: '/reports' },
  { name: 'Settings', path: 'laboratory/src/pages/settings/Settings.js', route: '/settings' }
];

const components = [
  { name: 'MainLayout', path: 'laboratory/src/components/Layout/MainLayout.js' },
  { name: 'Header', path: 'laboratory/src/components/Layout/Header.js' },
  { name: 'Sidebar', path: 'laboratory/src/components/Layout/Sidebar.js' }
];

const otherFiles = [
  { name: 'App Router', path: 'laboratory/src/AppNew.js' },
  { name: 'Global Styles', path: 'laboratory/src/styles/globals.css' }
];

let allPassed = true;

// Test Pages
console.log('📄 Testing Pages:');
pages.forEach(page => {
  const exists = fs.existsSync(page.path);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${page.name} (${page.route})`);
  if (!exists) allPassed = false;
});

console.log('\n🧩 Testing Components:');
components.forEach(component => {
  const exists = fs.existsSync(component.path);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${component.name}`);
  if (!exists) allPassed = false;
});

console.log('\n📦 Testing Other Files:');
otherFiles.forEach(file => {
  const exists = fs.existsSync(file.path);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file.name}`);
  if (!exists) allPassed = false;
});

// Check AppNew.js for route imports
console.log('\n🔗 Testing Route Configuration:');
try {
  const appContent = fs.readFileSync('laboratory/src/AppNew.js', 'utf8');
  
  const imports = [
    'DashboardNew',
    'InvoiceList',
    'EMIManagement',
    'PartyLedger',
    'InventoryList',
    'DoctorList',
    'PackageList',
    'ReportsList',
    'Settings'
  ];
  
  imports.forEach(importName => {
    const hasImport = appContent.includes(`import ${importName}`);
    const status = hasImport ? '✅' : '❌';
    console.log(`${status} ${importName} imported`);
    if (!hasImport) allPassed = false;
  });
  
  const routes = [
    '/dashboard',
    '/billing',
    '/emi',
    '/ledger',
    '/inventory',
    '/doctors',
    '/packages',
    '/reports',
    '/settings'
  ];
  
  console.log('\n🛣️  Testing Routes:');
  routes.forEach(route => {
    const hasRoute = appContent.includes(`path="${route}"`);
    const status = hasRoute ? '✅' : '❌';
    console.log(`${status} ${route} route configured`);
    if (!hasRoute) allPassed = false;
  });
  
} catch (error) {
  console.log('❌ Error reading AppNew.js:', error.message);
  allPassed = false;
}

// Summary
console.log('\n' + '='.repeat(50));
if (allPassed) {
  console.log('✅ ALL TESTS PASSED!');
  console.log('\n🎉 Frontend is ready!');
  console.log('\n📋 Next Steps:');
  console.log('1. Start the backend: cd backend && node working-server.js');
  console.log('2. Start the frontend: cd laboratory && npm start');
  console.log('3. Login with: admin / admin123');
  console.log('4. Test all pages and features');
} else {
  console.log('❌ SOME TESTS FAILED!');
  console.log('Please check the errors above and fix them.');
}
console.log('='.repeat(50));
