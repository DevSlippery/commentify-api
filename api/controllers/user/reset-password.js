module.exports = {
  friendlyName: "Reset password",

  description: "",

  inputs: {
    password: {
      type: "string",
      required: true,
    },
    token: {
      type: "string",
      required: true,
    },
  },

  exits: {},

  fn: async function (inputs) {
    try {
      const { password, token } = inputs;

      const findPasswordToken = await User.findOne({
        passwordResetToken: token,
      });
      if (
        !findPasswordToken ||
        findPasswordToken.passwordResetTokenExpiresAt <= Date.now()
      ) {
        return this.res.status(404).json({
          message: "Your reset token is either invalid or expired!",
        });
      }
      const hashedPassword = await sails.helpers.passwords.hashPassword(
        password
      );

      await User.updateOne({ id: findPasswordToken.id }).set({
        password: hashedPassword,
        passwordResetToken: "",
        passwordResetTokenExpiresAt: 0,
      });

      const tokenJwt = await sails.helpers.generateNewJwtToken(
        findPasswordToken.email
      );

      this.req.user = findPasswordToken;

      return this.res.status(200).json({
        message: `Password reset successful. ${findPasswordToken.email} has been logged in`,
        data: findPasswordToken,
        tokenJwt,
      });
    } catch (error) {
      console.log(error);
      return this.res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};
