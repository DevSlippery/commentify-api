const flaverr = require("flaverr");
module.exports = {
  friendlyName: "Register",

  description: "Register user.",

  inputs: {
    firstname: {
      type: "string",
      required: true,
    },
    lastname: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    birthDay: {
      type: "string",
      required: true,
    },
    grender: {
      type: "string",
      required: true,
    },
    username: {
      type: "string",
      required: true,
      unique: true,
    },
    password: {
      type: "string",
      required: true,
      minLength: 8,
    },
  },

  exits: {},

  fn: async function (inputs) {
    try {
      const {
        firstname,
        lastname,
        email,
        password,
        birthDay,
        grender,
        username,
        password,
      } = inputs;

      const findUser = await User.findOne({ email: email });
      if (findUser) {
        throw flaverr("E_USER_EXIST", new Error("This user exist!"));
      }
      const newEmailAddress = email.toLowerCase();
      const token = await sails.helpers.strings.random("url-friendly");

      const addUser = await User.create({
        firstname: firstname,
        lastname: lastname,
        email: newEmailAddress,
        password: password,
        birthDay: birthDay,
        grender: grender,
        username: username,
        emailProofToken: token,
        emailProofTokenExpiresAt:
          Date.now() + sails.config.custom.emailProofTokenTTL,
      }).fetch();

      const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${token}`;

      const email = {
        to: addUser.email,
        subject: "Confirm Your account",
        template: "confirm",
        context: {
          name: `${addUser.firstname} ${addUser.lastname}`,
          confirmLink: confirmLink,
        },
      };
      await sails.helpers.sendMail(email);

      return exits.success({
        message: `An account has been created for ${addUser.email} successfully. Check your email to verify`,
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};
