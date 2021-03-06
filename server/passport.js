const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


const db = require('../db/db');

if(process.env.NODE_ENV !== 'production'){
	var configAuth = require('../config/auth');
}


module.exports = function(passport) {

	passport.serializeUser((user, done) => {
    	done(null, user);
	});

	passport.deserializeUser(function(user, done){
    done(null, user);
	});

	passport.use(new GoogleStrategy({
		clientID: process.env.clientID || configAuth.googleAuth.clientID,
		clientSecret: process.env.clientSecret || configAuth.googleAuth.clientSecret,
		callbackURL: process.env.callbackURL || configAuth.googleAuth.callbackURL
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function(){
			profile.photos[0].value = profile.photos[0].value.substring(0, profile.photos[0].value.length - 2) + '250';
			console.log(profile.photos[0].value, "THIS IS YOUR PROFILE!!")
			//look for user
			db.query(`SELECT * FROM users WHERE googleemail = '${profile.emails[0].value}'`, function(err, result){
				if(err) {
					done(err);
				}
				//if the user exists, call the done callback on the user
				if(result.rows.length) {
					return done(null, result.rows[0]);
				} else {
					//if the user doesn't exist, add the user to the database
					db.query(`INSERT INTO users (displayname, googleemail, picture)
					 VALUES ('${profile.name.givenName}', '${profile.emails[0].value}', '${profile.photos[0].value}')`, function(err, result) {
					 	if(err) {
					 		throw err;
					 	}
					 	else {
					 		return done(null, result.rows[0]);
					 	}
					})
				}
			})
		})
	}))
}