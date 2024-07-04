
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Пошук або створення користувача
            let user = await User.findOne({ where: { googleid: profile.id } });
            if (!user) {
                console.log('Creating new user with Google profile: ', profile);
                user = await User.create({
                    googleid: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    emailconfirmed: true
                });
            }
            done(null, user);
        } catch (error) {
            console.error('Error during user creation: ', error);
            done(error, false);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

module.exports = passport;

