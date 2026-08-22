/**
 * Production / default environment.
 *
 * The API base URL is no longer hard-coded inside each service. Change it here
 * (or via the `development` file replacement configured in angular.json).
 */
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.pratikdairy.com',
  appName: 'Pratik Dairy & Sweets',
  /** Milliseconds before token expiry at which the session is treated as expired. */
  tokenExpiryLeewayMs: 30_000,
};
