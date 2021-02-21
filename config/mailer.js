module.exports.mailer = {
    transport: {
      host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "soporte.commentify@gmail.com",
          pass: "@commentifysupport",
        },
    },
  }