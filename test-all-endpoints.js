const axios = require('axios');

async function testAllEndpoints() {
  const baseURL = 'http://localhost:3000';
  
  console.log('🚀 Testing All ONDC Endpoints...\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Health Check...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Health Check:', health.data.success ? 'PASS' : 'FAIL');
    
    // Test 2: System Status
    console.log('\n2. System Status...');
    const status = await axios.get(`${baseURL}/ondc/status`);
    console.log('✅ System Status:', status.data.success ? 'PASS' : 'FAIL');
    
    // Test 3: Generate Keys
    console.log('\n3. Generate Keys...');
    const keys = await axios.post(`${baseURL}/ondc/generate-keys`, {
      subscriberId: 'tsp-seller.ondc.docboyz.in'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Generate Keys:', keys.data.success ? 'PASS' : 'FAIL');
    const uniqueKeyId = keys.data.data?.uniqueKeyId;
    console.log('   Unique Key ID:', uniqueKeyId);
    
    // Test 4: Generate Verification
    console.log('\n4. Generate Verification...');
    const verification = await axios.post(`${baseURL}/ondc/generate-verification`, {
      subscriberId: 'tsp-seller.ondc.docboyz.in',
      uniqueKeyId: uniqueKeyId
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Generate Verification:', verification.data.success ? 'PASS' : 'FAIL');
    
    // Test 5: Get Verification File
    console.log('\n5. Get Verification File...');
    try {
      const verificationFile = await axios.get(`${baseURL}/ondc-site-verification.html`);
      console.log('✅ Get Verification File: PASS');
    } catch (error) {
      console.log('❌ Get Verification File: FAIL -', error.response?.status);
    }
    
    // Test 6: Subscribe to Registry
    console.log('\n6. Subscribe to Registry...');
    try {
      const subscribe = await axios.post(`${baseURL}/ondc/subscribe`, {
        opsNo: 2,
        subscriberId: 'tsp-seller.ondc.docboyz.in',
        uniqueKeyId: uniqueKeyId,
        environment: 'staging',
        entityData: {
          legalEntityName: 'Novacred Private Limited',
          businessAddress: 'Your Business Address, City, State, PIN',
          cityCodes: ['std:080'],
          gstNo: '27AAACN2082N1Z8',
          panName: 'Novacred Private Limited',
          panNo: 'AALCM8972B',
          dateOfIncorporation: '01/01/2020',
          authorisedSignatoryName: 'Authorised Signatory',
          authorisedSignatoryAddress: 'Signatory Address',
          emailId: 'onenovacred@gmail.com',
          mobileNo: '9876543210',
          country: 'IND'
        },
        networkParticipants: [{
          type: 'sellerApp',
          msn: false,
          cityCodes: ['std:080'],
          subscriberUrl: '/',
          domain: 'nic2004:60232'
        }]
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      });
      console.log('✅ Subscribe to Registry:', subscribe.data.success ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ Subscribe to Registry: FAIL -', error.code || error.message);
    }
    
    // Test 7: Handle Registry Callback
    console.log('\n7. Handle Registry Callback...');
    try {
      const callback = await axios.post(`${baseURL}/ondc/callback/on_subscribe`, {
        subscriber_id: 'tsp-seller.ondc.docboyz.in',
        challenge: 'base64-encrypted-challenge-string'
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'X-Environment': 'staging'
        }
      });
      console.log('✅ Handle Registry Callback:', callback.data.success ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ Handle Registry Callback: FAIL -', error.response?.status, error.response?.data?.error);
    }
    
    // Test 8: Lookup
    console.log('\n8. Lookup...');
    try {
      const lookup = await axios.post(`${baseURL}/ondc/lookup`, {
        searchParams: {
          country: 'IND',
          domain: 'ONDC:LOG10',
          type: 'sellerApp',
          city: 'std:080'
        },
        environment: 'staging'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      console.log('✅ Lookup:', lookup.data.success ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ Lookup: FAIL -', error.code || error.message);
    }
    
    // Test 9: VLookup
    console.log('\n9. VLookup...');
    try {
      const vlookup = await axios.post(`${baseURL}/ondc/vlookup`, {
        searchParams: {
          sender_subscriber_id: 'tsp-seller.ondc.docboyz.in',
          request_id: 'test-request-id',
          timestamp: '2023-12-07T10:30:00.000Z',
          signature: 'test-signature',
          search_parameters: {
            country: 'IND',
            domain: 'ONDC:LOG10',
            type: 'sellerApp'
          }
        },
        environment: 'staging'
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      console.log('✅ VLookup:', vlookup.data.success ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ VLookup: FAIL -', error.code || error.message);
    }
    
    // Test 10: List Keys
    console.log('\n10. List Keys...');
    const listKeys = await axios.get(`${baseURL}/ondc/keys`);
    console.log('✅ List Keys:', listKeys.data.success ? 'PASS' : 'FAIL');
    
    // Test 11: Get Specific Key
    console.log('\n11. Get Specific Key...');
    try {
      const getKey = await axios.get(`${baseURL}/ondc/keys/tsp-seller.ondc.docboyz.in/${uniqueKeyId}`);
      console.log('✅ Get Specific Key:', getKey.data.success ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ Get Specific Key: FAIL -', error.response?.status, error.response?.data?.error);
    }
    
    // Test 12: Delete Key
    console.log('\n12. Delete Key...');
    try {
      const deleteKey = await axios.delete(`${baseURL}/ondc/keys/tsp-seller.ondc.docboyz.in/${uniqueKeyId}`);
      console.log('✅ Delete Key:', deleteKey.data.success ? 'PASS' : 'FAIL');
    } catch (error) {
      console.log('❌ Delete Key: FAIL -', error.response?.status, error.response?.data?.error);
    }
    
    // Test 13: Root Endpoint
    console.log('\n13. Root Endpoint...');
    const root = await axios.get(`${baseURL}/`);
    console.log('✅ Root Endpoint:', root.data.success ? 'PASS' : 'FAIL');
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAllEndpoints();
