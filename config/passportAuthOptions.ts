/**
 * Passport configuration options.
 */
export const facebookPassportOptions = {
  clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
  clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
  callbackURL: `${process.env.BACKEND_BASE_URL}/auth/redirect`,
  profileFields: ['id', 'displayName', 'photos', 'email']
};
