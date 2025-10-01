const axios = require('axios');

async function testBodyParsing() {
  try {
    console.log('Testing body parsing...');
    
    // Test 1: Simple endpoint
    console.log('\n1. Testing /test-simple...');
    const response1 = await axios.post('http://localhost:3000/test-simple', {
      subscriberId: 'test-subscriber',
      uniqueKeyId: 'test-key'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response1.data);
    
    // Test 2: Raw endpoint
    console.log('\n2. Testing /test-raw...');
    const response2 = await axios.post('http://localhost:3000/test-raw', {
      subscriberId: 'test-subscriber',
      uniqueKeyId: 'test-key'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response2.data);
    
    // Test 3: Generate keys
    console.log('\n3. Testing /ondc/generate-keys...');
    const response3 = await axios.post('http://localhost:3000/ondc/generate-keys', {
      subscriberId: 'tsp-seller.ondc.docboyz.in'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response3.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testBodyParsing();

