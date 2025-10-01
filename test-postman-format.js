const axios = require('axios');

async function testPostmanFormat() {
  console.log('🧪 Testing Endpoints in Postman Format...\n');
  
  const baseURL = 'http://localhost:3000';
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Health Check');
    console.log('Method: GET');
    console.log('URL:', `${baseURL}/health`);
    console.log('Headers: None');
    console.log('Body: None');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Result:', health.data.message);
    console.log('---\n');
    
    // Test 2: System Status
    console.log('2️⃣ System Status');
    console.log('Method: GET');
    console.log('URL:', `${baseURL}/ondc/status`);
    console.log('Headers: None');
    console.log('Body: None');
    const status = await axios.get(`${baseURL}/ondc/status`);
    console.log('✅ Result:', status.data.data.subscriberId);
    console.log('---\n');
    
    // Test 3: Generate Keys
    console.log('3️⃣ Generate Keys');
    console.log('Method: POST');
    console.log('URL:', `${baseURL}/ondc/generate-keys`);
    console.log('Headers: Content-Type: application/json');
    console.log('Body:', JSON.stringify({subscriberId: 'tsp-seller.ondc.docboyz.in'}, null, 2));
    const keys = await axios.post(`${baseURL}/ondc/generate-keys`, {
      subscriberId: 'tsp-seller.ondc.docboyz.in'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Result: SUCCESS');
    console.log('Unique Key ID:', keys.data.data.uniqueKeyId);
    console.log('---\n');
    
    // Test 4: Generate Verification
    console.log('4️⃣ Generate Verification');
    console.log('Method: POST');
    console.log('URL:', `${baseURL}/ondc/generate-verification`);
    console.log('Headers: Content-Type: application/json');
    console.log('Body:', JSON.stringify({
      subscriberId: 'tsp-seller.ondc.docboyz.in',
      uniqueKeyId: keys.data.data.uniqueKeyId
    }, null, 2));
    const verification = await axios.post(`${baseURL}/ondc/generate-verification`, {
      subscriberId: 'tsp-seller.ondc.docboyz.in',
      uniqueKeyId: keys.data.data.uniqueKeyId
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Result: SUCCESS');
    console.log('---\n');
    
    // Test 5: Get Verification File
    console.log('5️⃣ Get Verification File');
    console.log('Method: GET');
    console.log('URL:', `${baseURL}/ondc-site-verification.html`);
    console.log('Headers: None');
    console.log('Body: None');
    const verificationFile = await axios.get(`${baseURL}/ondc-site-verification.html`);
    console.log('✅ Result: SUCCESS (HTML length:', verificationFile.data.length, 'chars)');
    console.log('---\n');
    
    // Test 6: List Keys
    console.log('6️⃣ List Keys');
    console.log('Method: GET');
    console.log('URL:', `${baseURL}/ondc/keys`);
    console.log('Headers: None');
    console.log('Body: None');
    const listKeys = await axios.get(`${baseURL}/ondc/keys`);
    console.log('✅ Result: SUCCESS (Found', listKeys.data.data.length, 'keys)');
    console.log('---\n');
    
    console.log('🎉 All endpoints are working perfectly!');
    console.log('\n📝 If you\'re getting errors in Postman:');
    console.log('1. Make sure Content-Type is "application/json"');
    console.log('2. Make sure you\'re using POST method for POST endpoints');
    console.log('3. Make sure the JSON body is valid');
    console.log('4. Try refreshing Postman or clearing cache');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPostmanFormat();

