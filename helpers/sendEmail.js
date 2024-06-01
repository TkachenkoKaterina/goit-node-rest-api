import sgMail from "@sendgrid/mail";

const { SENDGRID_API_KEY} = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const msg = { ...data };

  try {
    await sgMail.send(msg);
    console.log("Email sent to:", msg.to);
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("Error response body:", error.response.body);
    }
  }
};

export default sendEmail;
