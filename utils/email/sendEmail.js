const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const sendEmail = async (email, subject, payload, template) => {
  const FromEmail = process.env.EMAIL_USEREMAIL;
  const AppPAs = process.env.EMAIL_PASSWORD;
  try {
    // Protocole SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: FromEmail,
        pass: AppPAs,
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: FromEmail,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return res.status(200).json({
          success: true,
        });
      }
    });
  } catch (error) {
    console.log("error in sendEmail ", error);
  }
};

module.exports = sendEmail;
