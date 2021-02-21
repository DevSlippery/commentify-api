module.exports = {


  friendlyName: 'Login',


  description: 'Login user.',


  inputs: {
   email:{
     type:'string',
     required:true
   },
   password:{
     type:'string',
     required:true
   }
  },


  exits: {

  },


  fn: async function (inputs) {

   try {
     const {email, password} = inputs;

     const findUser = await User.findOne({email: email})
     if(!findUser){
       return this.res.status(404).json({
         error: "User not found!"
       })
     }
     await sails.helpers.passwords.checkPassword(password, findUser.password).intercept('incorrect', (error)=>{
       return this.res.status(401).json({
         error:'Password do not match!'
       })
     })
     const token = await sails.helpers.generateNewJwtToken(findUser.email);

     this.req.me = findUser;

     return this.res.status(200).json({
       message:`${findUser.email} has been logged in`,
       data: findUser,
       token
     })
   } catch (error) {
     console.log(error);
     if(error.isOperational){
       return this.res.status(400).json({
         message:`Error logging in user ${findUser.email}`,
         error: error.raw
       })
     }
     return this.res.status(500).json({
       message:`Error logging in user ${inputs.email}`,
       error: error.message
     })
   }

  }


};
