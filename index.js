const crypto = require('crypto');

/**
 * Class representing Two-Factor Authentication (2FA) functionality.
 */
class TwoFactorAuth {
    /**
     * Generates a secure key in Base32 format for TOTP.
     * This key can be used to set up 2FA in authenticator apps.
     * @param {number} [length=20] - Length of the generated secure key.
     * @returns {string} The generated secure key in Base32 format.
     */
    generateSecretKey(length = 20) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let secret = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = crypto.randomInt(0, chars.length);
            secret += chars[randomIndex];
        }
        return secret;
    }

    /**
     * Generates a Time-Based One-Time Password (TOTP) based on the provided secret key.
     * The OTP changes every 30 seconds by default.
     * @param {string} secret - The Base32 encoded secret key.
     * @param {number} [timeStep=30] - The time step in seconds (default is 30 seconds).
     * @returns {string} The generated 6-digit OTP.
     */
    generateOTP(secret, timeStep = 30) {
        const time = Math.floor(Date.now() / 1000 / timeStep);
        const key = Buffer.from(secret, 'base32');
        const buffer = Buffer.alloc(8);

        for (let i = 7; i >= 0; i--) {
            buffer[i] = time & 0xff;
            time >>= 8;
        }

        const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
        const offset = hmac[19] & 0xf;
        const otp =
            (((hmac[offset] & 0x7f) << 24) |
                ((hmac[offset + 1] & 0xff) << 16) |
                ((hmac[offset + 2] & 0xff) << 8) |
                (hmac[offset + 3] & 0xff)) %
            1000000;

        return otp.toString().padStart(6, '0'); // 6-digit OTP
    }

    /**
     * Verifies the provided OTP against the generated OTP within a specified time window.
     * This helps account for slight timing discrepancies.
     * @param {string} secret - The Base32 encoded secret key.
     * @param {string} token - The OTP to verify.
     * @param {number} [window=1] - The time window in which to allow for time drift (default is ±1).
     * @returns {boolean} Returns `true` if the OTP is valid, otherwise `false`.
     */
    verifyOTP(secret, token, window = 1) {
        const timeStep = 30;
        const currentTime = Math.floor(Date.now() / 1000 / timeStep);

        for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
            const time = currentTime + errorWindow;
            const buffer = Buffer.alloc(8);

            for (let i = 7; i >= 0; i--) {
                buffer[i] = time & 0xff;
                time >>= 8;
            }

            const key = Buffer.from(secret, 'base32');
            const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
            const offset = hmac[19] & 0xf;
            const otp =
                (((hmac[offset] & 0x7f) << 24) |
                    ((hmac[offset + 1] & 0xff) << 16) |
                    ((hmac[offset + 2] & 0xff) << 8) |
                    (hmac[offset + 3] & 0xff)) %
                1000000;

            if (otp.toString().padStart(6, '0') === token) {
                return true; // OTP is valid
            }
        }
        return false; // OTP is invalid
    }

    /**
     * Generates an `otpauth://` URI for use with authenticator apps.
     * This URI can be used to generate a QR code for easy scanning.
     * @param {string} secret - The Base32 encoded secret key.
     * @param {string} [accountName='user@example.com'] - The account name (often the user's email).
     * @param {string} [issuer='MyApp'] - The name of the issuing organization or application.
     * @returns {string} The `otpauth://` URI string for the secret key.
     */
    generateOtpauthURL(
        secret,
        accountName = 'user@example.com',
        issuer = 'MyApp'
    ) {
        return `otpauth://totp/${encodeURIComponent(
            issuer
        )}:${encodeURIComponent(
            accountName
        )}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    }
}

module.exports = TwoFactorAuth;
