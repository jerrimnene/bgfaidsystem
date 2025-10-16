#!/usr/bin/env node

/**
 * Role-Based Navigation Test Script
 * Tests that each role sees appropriate navigation items and dashboard content
 */

const puppeteer = require('puppeteer');

// Test user credentials for each role
const testUsers = [
  { email: 'project.officer@bgf.com', role: 'Project Officer', expectedNavItems: ['Dashboard', 'Review Applications', 'My Assignments'] },
  { email: 'program.manager@bgf.com', role: 'Program Manager', expectedNavItems: ['Dashboard', 'Assign Applications', 'Review Applications', 'Team Management'] },
  { email: 'finance.director@bgf.com', role: 'Finance Director', expectedNavItems: ['Dashboard', 'Approve Applications', 'Financial Reports'] },
  { email: 'hospital.director@bgf.com', role: 'Hospital Director', expectedNavItems: ['Dashboard', 'Medical Review', 'Medical Reports'] },
  { email: 'executive.director@bgf.com', role: 'Executive Director', expectedNavItems: ['Dashboard', 'Reports & Analytics', 'System Management'] },
  { email: 'ceo@bgf.com', role: 'CEO', expectedNavItems: ['Dashboard', 'Reports & Analytics', 'System Management'] },
  { email: 'founder.male@bgf.com', role: 'Founder', expectedNavItems: ['Dashboard', 'Final Approval', 'Impact Reports', 'System Overview'] },
  { email: 'admin@bgf.com', role: 'Admin', expectedNavItems: ['Dashboard', 'User Management', 'System Settings', 'Reports & Analytics'] }
];

async function testRoleBasedAccess() {
  console.log('🚀 Starting Role-Based Navigation Tests...\n');
  
  const browser = await puppeteer.launch({ headless: false, slowMo: 500 });
  const results = [];

  for (const user of testUsers) {
    console.log(`🔍 Testing ${user.role} (${user.email})...`);
    
    try {
      const page = await browser.newPage();
      await page.goto('http://localhost:3000/auth/login');

      // Login
      await page.type('input[name="email"]', user.email);
      await page.type('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');

      // Wait for redirect to dashboard
      await page.waitForNavigation();
      await page.waitForSelector('nav', { timeout: 5000 });

      // Check navigation items
      const navItems = await page.evaluate(() => {
        const navLinks = Array.from(document.querySelectorAll('nav a'));
        return navLinks.map(link => link.textContent?.trim()).filter(text => text && text !== '');
      });

      // Check dashboard content
      const dashboardTitle = await page.evaluate(() => {
        const title = document.querySelector('h1');
        return title ? title.textContent?.trim() : 'No title found';
      });

      // Check for role-specific content
      const hasApprovalActions = await page.evaluate(() => {
        return document.querySelector('[data-testid="approval-actions"], .workflow-manager, button:contains("Approve")') !== null;
      });

      const hasNotifications = await page.evaluate(() => {
        const bell = document.querySelector('[data-testid="notification-bell"], .bell, svg[class*="bell"]');
        const badge = bell?.querySelector('.badge, [class*="badge"], span[class*="bg-red"]');
        return { hasBell: !!bell, hasUnreadCount: !!badge };
      });

      const testResult = {
        role: user.role,
        email: user.email,
        success: true,
        navItems: navItems,
        expectedNavItems: user.expectedNavItems,
        dashboardTitle: dashboardTitle,
        hasApprovalActions: hasApprovalActions,
        notifications: hasNotifications,
        issues: []
      };

      // Check if expected nav items are present
      const missingNavItems = user.expectedNavItems.filter(expected => 
        !navItems.some(actual => actual.toLowerCase().includes(expected.toLowerCase()))
      );

      if (missingNavItems.length > 0) {
        testResult.issues.push(`Missing navigation items: ${missingNavItems.join(', ')}`);
      }

      results.push(testResult);
      console.log(`✅ ${user.role}: Dashboard loaded - "${dashboardTitle}"`);
      console.log(`   Navigation: ${navItems.join(', ')}`);
      console.log(`   Notifications: ${hasNotifications.hasBell ? '🔔' : '❌'} Bell, ${hasNotifications.hasUnreadCount ? '🔴' : '⚪'} Unread`);
      console.log(`   Approval Actions: ${hasApprovalActions ? '✅' : '❌'}`);
      
      if (testResult.issues.length > 0) {
        console.log(`⚠️  Issues: ${testResult.issues.join('; ')}`);
      }
      console.log('');

      await page.close();

    } catch (error) {
      console.log(`❌ ${user.role}: Test failed - ${error.message}\n`);
      results.push({
        role: user.role,
        email: user.email,
        success: false,
        error: error.message,
        issues: [`Test failed: ${error.message}`]
      });
    }
  }

  await browser.close();
  return results;
}

async function generateTestReport(results) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 ROLE-BASED NAVIGATION TEST REPORT');
  console.log('='.repeat(60));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n✅ Successful Tests: ${successful.length}/${results.length}`);
  console.log(`❌ Failed Tests: ${failed.length}/${results.length}`);

  if (failed.length > 0) {
    console.log('\n🚨 FAILED TESTS:');
    failed.forEach(result => {
      console.log(`   • ${result.role}: ${result.error}`);
    });
  }

  console.log('\n🔍 ROLE ANALYSIS:');
  successful.forEach(result => {
    console.log(`\n${result.role} (${result.email}):`);
    console.log(`   Dashboard: ${result.dashboardTitle}`);
    console.log(`   Navigation Items: ${result.navItems?.length || 0} items`);
    console.log(`   Notifications: ${result.notifications?.hasBell ? '✓' : '✗'} System`);
    console.log(`   Approval Actions: ${result.hasApprovalActions ? '✓' : '✗'} Available`);
    
    if (result.issues && result.issues.length > 0) {
      console.log(`   Issues: ${result.issues.join('; ')}`);
    }
  });

  console.log('\n📋 RECOMMENDATIONS:');
  const allIssues = results.flatMap(r => r.issues || []);
  const uniqueIssues = [...new Set(allIssues)];
  
  if (uniqueIssues.length > 0) {
    uniqueIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  } else {
    console.log('   🎉 All role-based navigation tests passed successfully!');
  }

  console.log('\n' + '='.repeat(60));
}

// Run the tests
if (require.main === module) {
  testRoleBasedAccess()
    .then(generateTestReport)
    .catch(console.error);
}

module.exports = { testRoleBasedAccess, generateTestReport };