const axios = require('axios');

async function runEndpointSequence() {
  const baseURL = 'http://localhost:3000';
  let uniqueKeyId = null;
  
  console.log('🚀 Running ONDC Endpoint Sequence...\n');
  
  try {
    // Step 1: Health Check
    console.log('1️⃣ Health Check...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅', health.data.message);
    
    // Step 2: System Status
    console.log('\n2️⃣ System Status...');
    const status = await axios.get(`${baseURL}/ondc/status`);
    console.log('✅', status.data.message);
    
    // Step 3: Generate Keys
    console.log('\n3️⃣ Generate Keys...');
    const keys = await axios.post(`${baseURL}/ondc/generate-keys`, {
      subscriberId: 'tsp-seller.ondc.docboyz.in'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    uniqueKeyId = keys.data.data.uniqueKeyId;
    console.log('✅ Keys generated. Unique Key ID:', uniqueKeyId);
    
    // Step 4: Generate Verification
    console.log('\n4️⃣ Generate Verification...');
    const verification = await axios.post(`${baseURL}/ondc/generate-verification`, {
      subscriberId: 'tsp-seller.ondc.docboyz.in',
      uniqueKeyId: uniqueKeyId
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅', verification.data.message);
    
    // Step 5: Get Verification File
    console.log('\n5️⃣ Get Verification File...');
    const verificationFile = await axios.get(`${baseURL}/ondc-site-verification.html`);
    console.log('✅ Verification file retrieved (length:', verificationFile.data.length, 'chars)');
    
    // Step 6: List Keys
    console.log('\n6️⃣ List Keys...');
    const listKeys = await axios.get(`${baseURL}/ondc/keys`);
    console.log('✅ Found', listKeys.data.data.length, 'key pairs');
    
    // Step 7: Get Specific Key
    console.log('\n7️⃣ Get Specific Key...');
    const getKey = await axios.get(`${baseURL}/ondc/keys/tsp-seller.ondc.docboyz.in/${uniqueKeyId}`);
    console.log('✅ Key pair retrieved successfully');
    
    // Step 8: Subscribe (External API - may fail)
    console.log('\n8️⃣ Subscribe to Registry...');
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
        timeout: 10000
      });
      console.log('✅', subscribe.data.message);
    } catch (error) {
      console.log('❌ External API not accessible:', error.code || error.message);
    }
    
    // Step 9: Handle Callback (External API - may fail)
    console.log('\n9️⃣ Handle Registry Callback...');
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
      console.log('✅', callback.data.message);
    } catch (error) {
      console.log('❌ External API not accessible:', error.code || error.message);
    }
    
    // Step 10: Lookup (External API - may fail)
    console.log('\n🔟 Lookup...');
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
      console.log('✅', lookup.data.message);
    } catch (error) {
      console.log('❌ External API not accessible:', error.code || error.message);
    }
    
    // Step 11: VLookup (External API - may fail)
    console.log('\n1️⃣1️⃣ VLookup...');
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
      console.log('✅', vlookup.data.message);
    } catch (error) {
      console.log('❌ External API not accessible:', error.code || error.message);
    }
    
    // Step 12: Delete Key (Optional)
    console.log('\n1️⃣2️⃣ Delete Key...');
    const deleteKey = await axios.delete(`${baseURL}/ondc/keys/tsp-seller.ondc.docboyz.in/${uniqueKeyId}`);
    console.log('✅', deleteKey.data.message);
    
    // Step 13: Root Endpoint
    console.log('\n1️⃣3️⃣ Root Endpoint...');
    const root = await axios.get(`${baseURL}/`);
    console.log('✅', root.data.message);
    
    console.log('\n🎉 All endpoints tested successfully!');
    console.log('\n📝 Note: External API endpoints (8-11) may fail locally as they require ONDC registry access.');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

runEndpointSequence();

