const nodemailer = require("nodemailer");

const sendEmail = async function (options) {
  const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_EMAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Deepu Singh <${process.env.SMPT_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: "<b>Hello world?</b>",
  };

  const info = await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
