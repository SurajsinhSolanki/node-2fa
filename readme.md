# @surajsinh-solanki/easy2fa

@surajsinh-solanki/easy2fa is a lightweight Node.js package for managing Two-Factor Authentication (2FA) using Time-Based One-Time Passwords (TOTP). This package is dependency-free, fast, and compatible with popular authenticator apps like Google Authenticator, Authy, and GitHub.

## Features

- Generates secure Base32 keys for TOTP
- Generates time-based one-time passwords (6-digit OTPs)
- Verifies OTPs within a configurable time window
- Provides `otpauth://` URIs for easy setup with authenticator apps

## Installation

Install @surajsinh-solanki/easy2fa via npm:

```bash
npm install @surajsinh-solanki/easy2fa
```

## Usage

Here's how to get started with @surajsinh-solanki/easy2fa:

### 1. Import and Initialize

```javascript
const Easy2FA = require('@surajsinh-solanki/easy2fa');
const otp = new Easy2FA();
```

### 2. Generate a Secure Key

To create a Base32-encoded secret key that can be stored and used to generate OTPs:

```javascript
const secretKey = otp.generateSecretKey();
console.log('Secret Key:', secretKey);
```

### 3. Generate an OTP

Using the generated secret key, you can create a 6-digit OTP:

```javascript
const token = otp.generateOTP(secretKey);
console.log('OTP:', token);
```

### 4. Verify an OTP

Check if a provided OTP is valid. The verification allows for a time window to account for slight time drifts:

```javascript
const isValid = otp.verifyOTP(secretKey, token);
console.log('Is OTP valid?', isValid);
```

### 5. Generate otpauth:// URI for QR Code

To generate a URI that can be turned into a QR code for easy scanning with authenticator apps:

```javascript
const otpauthURL = otp.generateOtpauthURL(secretKey, 'user@example.com', '@surajsinh-solanki/easy2faApp');
console.log('otpauth:// URI:', otpauthURL);
```

## Example

```javascript
const Easy2FA = require('@surajsinh-solanki/easy2fa');
const otp = new Easy2FA();

// Generate a secure key
const secretKey = otp.generateSecretKey();
console.log('Secret Key:', secretKey);

// Generate OTP
const token = otp.generateOTP(secretKey);
console.log('OTP:', token);

// Verify OTP
const isValid = otp.verifyOTP(secretKey, token);
console.log('Is OTP valid?', isValid);

// Generate otpauth URL for QR code generation
const otpauthURL = otp.generateOtpauthURL(secretKey, 'user@example.com', '@surajsinh-solanki/easy2faApp');
console.log('otpauth:// URI:', otpauthURL);
```

## Methods

- `generateSecretKey(length = 20)`: Generates a secure Base32-encoded secret key for TOTP.
- `generateOTP(secret, timeStep = 30)`: Creates a 6-digit OTP based on the secret key.
- `verifyOTP(secret, token, window = 1)`: Verifies the OTP within a specified time window.
- `generateOtpauthURL(secret, accountName, issuer)`: Creates an `otpauth://` URI for easy integration with authenticator apps.

## License

@surajsinh-solanki/easy2fa is licensed under the MIT License.

## Contribution

Contributions are welcome! Please open issues and submit pull requests for any improvements, bug fixes, or feature requests.