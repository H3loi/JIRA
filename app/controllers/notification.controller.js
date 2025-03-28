const nodemailer = require('nodemailer');
const db = require("../config/db.config");

exports.sendEmailNotification = (req, res) => {
    const { email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'maria.eloiza.reyes.sitesphil.ojt@gmail.com',
        pass: 'efevcgaeqpomjhwv'
    }
    });

    const mailOptions = {
    from: 'maria.eloiza.reyes.sitesphil.ojt@gmail.com',
    to: email,
    subject: subject,
    text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
        return res.status(500).send({ message: "Error sending email", error });
        }
        res.status(200).send({ message: "Email sent successfully", info });
    });
}