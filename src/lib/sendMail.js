import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendMail(to, subject, content) {
    const mailOptions = {
        from: `"Habit Tracker" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html: content,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Failed to send email: ${error.message}`);
    }
}
