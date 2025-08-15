import nodemailer from "nodemailer";

export async function sendEmail ({
    to = "" , 
    subject = "Sara7a App" , 
    text = "", 
    html = "", 
    cc = "", 
    bcc = "", 
    attachments = []}) {
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});
  const info = await transporter.sendMail({
    from: `"Heba Ashraf " <${process.env.EMAIL}>`, /////?
    to,
    subject,
    text, // plain‑text body
    html, // HTML body
    cc,
    bcc,
    attachments
  });
  console.log("Message sent:", info.messageId);
}

export const emailSubject = {
    confirmEmail : "Confirm Your Email",
    resetPassword : "Reset Your Password",
    welcom: "Welcome To Sara7a App"
}