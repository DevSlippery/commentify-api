const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
module.exports = {
  friendlyName: "Send mail",

  description: "",

  inputs: {
    options: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const transporter = nodemailer.createTransport(
      sails.config.mailer.transport
    );
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".hbs",
          partialsDir: "./views",
          layoutsDir: "./views",
          defaultLayout: "",
        },
        viewPath: "./views/",
        extName: ".hbs",
      })
    );
    try {
      let emailOptions = {
        from: "Commentify Support <soporte.commentify@gmail.com>",
        ...inputs.options,
      };
      await transporter.sendMail(emailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Email Sent", inputs.options.to, info.response);
        }
      });
    } catch (error) {
      sails.log(error);
    }
  },
};
