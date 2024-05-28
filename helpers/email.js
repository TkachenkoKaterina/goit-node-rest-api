import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const msg = {
  to: "tkachenko.city@gmail.com", // Change to your recipient
  from: "tkachenko_kateryna@meta.ua", // Change to your verified sender
  subject: "First email by Node.js",
  text: "and easy to do anywhere, even with Node.js",
  html: "<H1>Test with Node.js</H1>",
};

sgMail
  .send(msg)
  .then(() => {
    console.log("Email sent");
  })
  .catch((error) => {
    console.error(error);
  });
