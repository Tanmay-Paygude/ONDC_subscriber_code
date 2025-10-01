# ONDC Network Participant API

A complete Node.js implementation for ONDC (Open Network for Digital Commerce) Network Participant registration and authentication system.

## Features

- ✅ **Ed25519 Signing Keys** - Generate and manage Ed25519 key pairs for digital signatures
- ✅ **X25519 Encryption Keys** - Generate and manage X25519 key pairs for secure key exchange
- ✅ **BLAKE-512 Hashing** - Cryptographic hashing for request integrity
- ✅ **Domain Verification** - Automatic generation of `ondc-site-verification.html` file
- ✅ **Registry Integration** - Complete ONDC registry API integration
- ✅ **Multi-Environment Support** - Staging, Pre-Production, and Production environments
- ✅ **Security Middleware** - Rate limiting, CORS, security headers
- ✅ **Comprehensive Validation** - Request/response validation using Joi
- ✅ **Logging** - Structured logging with Winston
- ✅ **Testing** - Unit and integration tests

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- SSL certificate for your domain
- ONDC Network Participant Portal access

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ondc-network-participant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   SUBSCRIBER_ID=tsp-seller.ondc.docboyz.in
   CALLBACK_URL=/ondc/callback
   SUBSCRIBER_URL=/
   ```

4. **Create required directories**
   ```bash
   mkdir -p keys logs public certs
   ```

## Quick Start

1. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

2. **Generate key pairs**
   ```bash
   curl -X POST http://localhost:3000/ondc/generate-keys \
     -H "Content-Type: application/json" \
     -d '{"subscriberId": "your-domain.com"}'
   ```

3. **Generate domain verification file**
   ```bash
   curl -X POST http://localhost:3000/ondc/generate-verification \
     -H "Content-Type: application/json" \
     -d '{"subscriberId": "tsp-seller.ondc.docboyz.in", "uniqueKeyId": "your-unique-key-id"}'
   ```

4. **Subscribe to ONDC Registry**
   ```bash
   curl -X POST http://localhost:3000/ondc/subscribe \
     -H "Content-Type: application/json" \
     -d '{
       "opsNo": 1,
       "subscriberId": "tsp-seller.ondc.docboyz.in",
       "uniqueKeyId": "your-unique-key-id",
       "environment": "staging",
       "entityData": {
         "legalEntityName": "Your Company Name",
         "businessAddress": "Your Business Address",
         "gstNo": "Your GST Number",
         "panName": "Your PAN Name",
         "panNo": "Your PAN Number",
         "dateOfIncorporation": "01/01/2020",
         "authorisedSignatoryName": "Authorised Signatory",
         "authorisedSignatoryAddress": "Signatory Address",
         "emailId": "contact@your-domain.com",
         "mobileNo": "9876543210"
       },
       "networkParticipants": [{
         "type": "buyerApp",
         "msn": false,
         "cityCodes": ["std:080"]
       }]
     }'
   ```

## API Endpoints

### Key Management
- `POST /ondc/generate-keys` - Generate Ed25519 and X25519 key pairs
- `GET /ondc/keys` - List all key pairs
- `GET /ondc/keys/:subscriberId/:uniqueKeyId` - Get specific key pair
- `DELETE /ondc/keys/:subscriberId/:uniqueKeyId` - Delete key pair

### Domain Verification
- `POST /ondc/generate-verification` - Generate domain verification file
- `GET /ondc/verification` - Get domain verification file

### Registry Operations
- `POST /ondc/subscribe` - Subscribe to ONDC registry
- `POST /ondc/callback/on_subscribe` - Handle registry callback
- `POST /ondc/lookup` - Lookup network participants
- `POST /ondc/vlookup` - VLookup network participants (deprecated)

### System
- `GET /health` - Health check
- `GET /ondc/status` - System status

## ONDC Registration Types

### 1. Buyer App (ops_no: 1)
```json
{
  "opsNo": 1,
  "networkParticipants": [{
    "type": "buyerApp",
    "msn": false,
    "cityCodes": ["std:080"]
  }]
}
```

### 2. Non-MSN Seller App (ops_no: 2)
```json
{
  "opsNo": 2,
  "networkParticipants": [{
    "type": "sellerApp",
    "msn": false,
    "cityCodes": ["std:080"]
  }]
}
```

### 3. MSN Seller App (ops_no: 3)
```json
{
  "opsNo": 3,
  "networkParticipants": [{
    "type": "sellerApp",
    "msn": true,
    "cityCodes": ["std:080"],
    "sellerOnRecord": [{
      "uniqueKeyId": "seller-key-id",
      "keyPair": {
        "signingPublicKey": "seller-signing-public-key",
        "encryptionPublicKey": "seller-encryption-public-key",
        "validFrom": "2023-01-01T00:00:00.000Z",
        "validUntil": "2024-01-01T00:00:00.000Z"
      },
      "cityCodes": ["std:080"]
    }]
  }]
}
```

### 4. Buyer and Non-MSN Seller (ops_no: 4)
```json
{
  "opsNo": 4,
  "networkParticipants": [
    {
      "type": "buyerApp",
      "msn": false,
      "cityCodes": ["std:080"]
    },
    {
      "type": "sellerApp",
      "msn": false,
      "cityCodes": ["std:080"]
    }
  ]
}
```

### 5. Buyer and MSN Seller (ops_no: 5)
```json
{
  "opsNo": 5,
  "networkParticipants": [
    {
      "type": "buyerApp",
      "msn": false,
      "cityCodes": ["std:080"]
    },
    {
      "type": "sellerApp",
      "msn": true,
      "cityCodes": ["std:080"],
      "sellerOnRecord": [{
        "uniqueKeyId": "seller-key-id",
        "keyPair": {
          "signingPublicKey": "seller-signing-public-key",
          "encryptionPublicKey": "seller-encryption-public-key",
          "validFrom": "2023-01-01T00:00:00.000Z",
          "validUntil": "2024-01-01T00:00:00.000Z"
        },
        "cityCodes": ["std:080"]
      }]
    }
  ]
}
```

## Environment Configuration

### Staging
- Registry URL: `https://staging.registry.ondc.org`
- ONDC Public Key: `MCowBQYDK2VuAyEAduMuZgmtpjdCuxv+Nc49K0cB6tL/Dj3HZetvVN7ZekM=`

### Pre-Production
- Registry URL: `https://preprod.registry.ondc.org`
- ONDC Public Key: `MCowBQYDK2VuAyEAa9Wbpvd9SsrpOZFcynyt/TO3x0Yrqyys4NUGIvyxX2Q=`

### Production
- Registry URL: `https://prod.registry.ondc.org`
- ONDC Public Key: `MCowBQYDK2VuAyEAvVEyZY91O2yV8w8/CAwVDAnqIZDJJUPdLUUKwLo3K0M=`

## Security Features

- **Rate Limiting** - Prevent abuse with configurable rate limits
- **CORS Protection** - Cross-origin resource sharing configuration
- **Security Headers** - Helmet.js security headers
- **Input Validation** - Joi schema validation
- **Error Handling** - Comprehensive error handling and logging
- **SSL/TLS Support** - HTTPS support for production

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test tests/crypto.test.js
```

## Deployment

### Production Deployment
1. Set up SSL certificates
2. Configure environment variables
3. Set up reverse proxy (nginx) - optional
4. Configure monitoring and logging
5. Set up backup for key storage

## Troubleshooting

### Common Issues

1. **Domain Verification Failed**
   - Ensure `ondc-site-verification.html` is accessible at `https://your-domain.com/ondc-site-verification.html`
   - Check that the file contains the correct signed request ID

2. **OCSP Failed**
   - Ensure your SSL certificate is valid and properly configured
   - Check that the certificate chain is complete

3. **Encryption Verification Failed**
   - Verify that the challenge decryption is working correctly
   - Check that the ONDC public key matches the environment

4. **Key Generation Issues**
   - Ensure you have sufficient permissions to create files in the keys directory
   - Check that the crypto libraries are properly installed

### Logs
Check the logs directory for detailed error information:
```bash
tail -f logs/ondc.log
tail -f logs/error.log
```

## Support

For ONDC-specific issues, contact:
- Email: techsupport@ondc.org
- ONDC Portal: https://portal.ondc.org

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Complete ONDC Network Participant implementation
- Support for all registration types (ops_no: 1-5)
- Multi-environment support
- Comprehensive testing
- Security middleware
- Documentation
