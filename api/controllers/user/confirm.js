module.exports = {
  friendlyName: "Confirm",

  description: "Confirm user.",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Email address confirmed and requesting user logged in.",
    },
    invalidOrExpiredToken: {
      statusCode: 400,
      description:
        "The provided token is expired, invalid, or already used up.",
    },
  },

  fn: async function (inputs) {
    const { token } = inputs;

    if (!token) {
      return "The provider token is expired, invalid, or already used!";
    }

    const findUserToken = await User.findOne({ emailProofToken: token });

    if (
      !findUserToken ||
      findUserToken.emailProofTokenExpiresAt <= Date.now()
    ) {
      return "The provider token is expired, invalid, or already used!";
    }

    if (findUserToken.emailStatus === "unconfirmed") {
      await User.updateOne({ id: findUserToken.id }).set({
        emailStatus: "confirmed",
        emailProofToken: "",
        emailProofTokenExpiresAt: 0,
      });
      return "Your account has been confirmed!";
    }
  },
};
