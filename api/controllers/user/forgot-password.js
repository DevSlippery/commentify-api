module.exports = {
  friendlyName: "Forgot password",

  description: "",

  inputs: {
    email: {
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    try {
      const { email } = inputs;

      const findUser = await User.findOne({ email: email });
      if (!findUser) {
        return this.res.status(400).json({
          message: "This user no exist",
        });
      }
      const token = await sails.helpers.strings.random("url-friendly");

      await User.updateOne({ id: findUser.id }).set({
        passwordResetToken: token,
        passwordResetTokenExpiresAt:
          Date.now() + sails.config.custom.passwordResetTokenTTL,
      });

      const recoveryLink = `${sails.config.custom.baseUrl}/user/reset-password?token=${token}`;

      const emailSend = {
        to: findUser.email,
        subject: "Reset Password",
        template: "forgot-password",
        context: {
          name: `${findUser.firstname} ${findUser.lastname}`,
          recoverLink: recoveryLink,
        },
      };
      try {
        await sails.helpers.sendMail(emailSend);
      } catch (error) {
        console.log(error);
      }

      return this.res.status(200).json({
        message: ` A reset password email has been sent to ${findUser.email}`,
      });
    } catch (error) {
      console.log(error);
      return this.res.status(500).json({
        error: error.message,
      });
    }
  },
};
