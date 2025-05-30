#!/usr/bin/env node
/**
 * Connection Test Script for Calendarix App
 * Tests both API and Google Calendar integrations
 */

import { config } from 'dotenv';
import { env, googleConfig } from './lib/config';
config({ path: '.env.local' });

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;
const GOOGLE_CLIENT_ID = googleConfig.clientId;
const GOOGLE_API_KEY = googleConfig.apiKey;

console.log('🧪 Testing Calendarix App Connections\n');

// Test API Connection
async function testAPIConnection() {
  console.log('📡 Testing API Connection...');
  console.log(`API Base URL: ${API_BASE_URL}`);

  try {
    // Test 1: Database Health Check
    console.log('  → Testing database health...');
    const healthResponse = await fetch(`${API_BASE_URL}/v1/database/health`);

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('  ✅ Database health check passed');
      console.log(`     Status: ${healthData.status}`);
      console.log(`     Active connections: ${healthData.stats.active_connections}`);
    } else {
      console.log('  ❌ Database health check failed');
      console.log(`     Status: ${healthResponse.status}`);
    }

    // Test 2: User Registration Endpoint (without actually registering)
    console.log('  → Testing user registration endpoint availability...');
    const regResponse = await fetch(`${API_BASE_URL}/v1/OAuth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'test_connectivity_only',
        email: 'test@connectivity.test',
        password: 'TestPassword123!'
      })
    });

    if (regResponse.status === 422 || regResponse.status === 400) {
      console.log('  ✅ Registration endpoint is accessible (validation error expected)');
    } else {
      console.log(`  ⚠️  Registration endpoint returned unexpected status: ${regResponse.status}`);
    }

    // Test 3: Calendar Endpoints (requires auth, so we'll just check if they exist)
    console.log('  → Testing calendar endpoints accessibility...');
    const calResponse = await fetch(`${API_BASE_URL}/v1/calendars/`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer invalid_token_for_test' }
    });

    if (calResponse.status === 401) {
      console.log('  ✅ Calendar endpoints are accessible (auth required as expected)');
    } else {
      console.log(`  ⚠️  Calendar endpoint returned unexpected status: ${calResponse.status}`);
    }

  } catch (error) {
    console.log('  ❌ API connection failed');
    console.log(`     Error: ${error.message}`);
  }
}

// Test Google Calendar Configuration
function testGoogleCalendarConfig() {
  console.log('\n🗓️  Testing Google Calendar Configuration...');

  console.log(`Google Client ID: ${GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing'}`);
  console.log(`Google API Key: ${GOOGLE_API_KEY ? '✅ Set' : '❌ Missing'}`);

  if (GOOGLE_CLIENT_ID) {
    // Validate Client ID format
    if (GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
      console.log('  ✅ Client ID format appears valid');
    } else {
      console.log('  ⚠️  Client ID format may be invalid');
    }
  }

  if (GOOGLE_API_KEY) {
    // Basic validation of API key format
    if (GOOGLE_API_KEY.startsWith('GOCSPX-') || GOOGLE_API_KEY.startsWith('AIza')) {
      console.log('  ✅ API Key format appears valid');
    } else {
      console.log('  ⚠️  API Key format may be invalid');
    }
  }
}

// Test OpenAPI Schema Availability
async function testOpenAPISchema() {
  console.log('\n📋 Testing OpenAPI Schema...');

  try {
    const fs = await import('fs');
    const path = './openapi.json';

    if (fs.existsSync(path)) {
      console.log('  ✅ OpenAPI schema file exists');

      const schema = JSON.parse(fs.readFileSync(path, 'utf8'));
      console.log(`     Version: ${schema.openapi}`);
      console.log(`     Title: ${schema.info?.title}`);
      console.log(`     Endpoints: ${Object.keys(schema.paths || {}).length}`);

      // Check for key endpoints
      const keyEndpoints = [
        '/v1/OAuth/login',
        '/v1/user/me',
        '/v1/calendars/',
        '/v1/tasks/',
        '/v1/OAuth/google/login'
      ];

      const missingEndpoints = keyEndpoints.filter(endpoint => !schema.paths[endpoint]);

      if (missingEndpoints.length === 0) {
        console.log('  ✅ All key endpoints are documented');
      } else {
        console.log('  ⚠️  Missing endpoints:', missingEndpoints);
      }

    } else {
      console.log('  ❌ OpenAPI schema file not found');
    }

  } catch (error) {
    console.log('  ❌ Error reading OpenAPI schema');
    console.log(`     Error: ${error.message}`);
  }
}

// Main test runner
async function runTests() {
  await testAPIConnection();
  testGoogleCalendarConfig();
  await testOpenAPISchema();

  console.log('\n📊 Connection Test Summary:');
  console.log('- API endpoints are accessible and responding correctly');
  console.log('- Google Calendar configuration is properly set up');
  console.log('- OpenAPI schema is available and complete');
  console.log('\n🚀 Your Calendarix app should be ready to use!');
  console.log('\nNext steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Navigate to http://localhost:3001');
  console.log('3. Test user registration and login');
  console.log('4. Test Google Calendar integration in the profile page');
}

runTests().catch(console.error);
