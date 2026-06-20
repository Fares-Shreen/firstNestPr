import nodemailer from "nodemailer";

const createTransport = () => {
    const email = process.env.EMAIL;
    const password = process.env.EMAIL_PASSWORD;

    if (!email || !password) {
        throw new Error(
            'Missing email credentials: set EMAIL and EMAIL_PASSWORD in your environment',
        );
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: password,
        },
    });
};

export const sendEmail = async ({ to, subject, attachements, html }: { to: string, subject: string, attachements?: any, html: string }) => {
    const transport = createTransport();
    const from = `"Social App" <${process.env.EMAIL}>`;

    const info = await transport.sendMail({
        from,
        to,
        subject,
        html,
    });

    console.log("Message sent: %s", info.messageId);
    return info.accepted.length > 0;
};

export const generateOTP = () => {
    const otp: number = Math.floor(100000 + Math.random() * 900000);
    return otp;
}