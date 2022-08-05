const { Strategy } = require('passport-google-oauth20')
const User = require('../model/user.js')
module.exports = function (passport) {
    passport.use(
        new Strategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "/auth/google/callback",
            },
            async function (accessToken, refreshToken, profile, done) {
                const newUser = {
                    googleID: profile.id,
                    displayname: profile.displayName,
                    firstname: profile.name.givenName,
                    lastname: profile.name.familyName,
                    image: profile.photos[0].value,
                }
                try {
                    const user = await User.findOne({ googleID: profile.id })
                    if (!user) {
                        User.create(newUser)
                        done(null, user)
                    }else{
                        done(null, user)
                    }
                } catch (error) {
                    console.log(error);
                }
            }))
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
        // where is this user.id going? Are we supposed to access this anywhere?
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}