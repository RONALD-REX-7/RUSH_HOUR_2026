/**
 * JWT Secret Configuration Helper
 * Ensures secure resolution of JWT_SECRET across authentication middleware,
 * services, and route handlers.
 * 
 * - In production: Fails fast and throws a fatal error if JWT_SECRET is unset.
 * - In development: Issues an explicit console warning and uses an ephemeral development fallback.
 */

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is missing in production deployment.');
    }
    console.warn('[Security Warning] JWT_SECRET is unset. Using ephemeral development fallback. Set JWT_SECRET in your .env file!');
    return 'problemchain_dev_ephemeral_fallback_secret_do_not_use_in_prod';
  }
  return secret;
}
