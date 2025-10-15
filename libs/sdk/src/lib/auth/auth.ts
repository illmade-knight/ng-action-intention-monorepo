/**
 * Defines the contract for an authentication provider.
 */
export interface Auth {
  login(): Promise<void>;
  logout(): Promise<void>;
  getAuthToken(): Promise<string>;
  isAuthenticated(): Promise<boolean>;
}
