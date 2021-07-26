export const facebookPassportOptions = {
  clientID: `${process.env.FACEBOOK_CLIENT_ID}`,
  clientSecret: `${process.env.FACEBOOK_CLIENT_SECRET}`,
  callbackURL: 'http://localhost:8000/api/v1/facebook-redirect/',
  profileFields: ['id', 'displayName', 'photos', 'email']
};
