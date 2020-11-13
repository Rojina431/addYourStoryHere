 const GoogleStrategy=require('passport-google-oauth20').Strategy
 const mongoose=require('mongoose');
const User=require('../models/User')

module.exports=function(passport){
    passport.use(new GoogleStrategy({
        clientID:process.env.Google_Client_ID,
        clientSecret:process.env.Google_Client_Secret,
        callbackURL:'/auth/google/callback'
    },
    async(accessToken,refreshToken,profile,done)=>{
        const newuser={
            googleId:profile.id,
            displayName:profile.displayName,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            image:profile.photos[0].value
        }
        try{
          let user=await User.findOne({googleId:profile.id})
          if(user){
              done(null,user)
          }else{
             user=await User.create(newuser)
             done(null,user)
          }
        }catch(err){
          console.log(err)
        }
    }))

    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user) =>done(err, user));
      });
}

