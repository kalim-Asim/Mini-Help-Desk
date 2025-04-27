import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendComplaintConfirmation = async (to: string, name: string, type: string, code: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "IIITA Help Desk - Ticket Submitted",
    html: `
      <h2>Your Ticket Has Been Submitted</h2>
      <p>Hi <span style="font-size: 1.1rem; color:rgb(85, 235, 15)">${name}</span>,</p>
      <p>Your complaint for <span style="font-size: 1.2rem; color:rgb(239, 51, 67)">${type}</span> is noted.</p>
      <p><strong>Your Ticket Code:</strong> <span style="font-size: 1.2rem; color: #4f46e5">${code}</span></p>
    `,
  });
};
