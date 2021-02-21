module.exports = async (req, res, proceed) => {
  const { email } = req.allParams();

  try {
    const findUserToVerify = await User.findOne({ email: email });
    if (!findUserToVerify) {
      return res.status(404).json({
        message: `${email} does not belong to a user`,
      });
    } else if (findUserToVerify.emailStatus === "unconfirmed") {
      return res.status(401).json({
        error:
          "This account has not been confirmed. Click on the link in the email sent to you to confirm",
      });
    } else {
      return proceed();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: error.message });
  }
};

