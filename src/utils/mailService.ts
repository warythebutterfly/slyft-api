import nodemailer, { Transporter } from "nodemailer";
//import sgMail from '@sendgrid/mail';
import dotenv from "dotenv";
import Logging from "../library/Logging";

dotenv.config();

interface EmailOptions {
  from?: string;
  to: string;
  cc?: string;
  subject: string;
  text?: string;
  html?: string;
}

interface EmailService {
  sendEmail(options: EmailOptions): Promise<any>;
  verifyConnection(): Promise<void>;
}

class NodemailerService implements EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      port: parseInt(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For testing purposes only; not recommended for production
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<any> {
    try {
      const info = await this.transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      Logging.info(`Email sent: ${info.response}`);
      return {
        success: true,
        message: "Email sent successfully.",
        data: { info },
      };
    } catch (error) {
      Logging.error(`Error sending email: ${error}`);
      return {
        success: false,
        errors: [`Error sending email`, error.message],
      };
    }
  }

  async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      Logging.info("SMTP connection verified.");
    } catch (error) {
      Logging.error(`SMTP connection verification failed:, ${error}`);
      throw error;
    }
  }
}

// class SendGridService implements EmailService {
//   constructor() {
//     sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   }

//   async sendEmail(options: EmailOptions): Promise<any> {
//     try {
//       await sgMail.send({
//         from: options.from,
//         to: options.to,
//         subject: options.subject,
//         text: options.text,
//         html: options.html,
//       });
//       console.log('Email sent via SendGrid');
//     } catch (error) {
//       console.error('Error sending email via SendGrid:', error);
//       throw error;
//     }
//   }

//   async verifyConnection(): Promise<void> {
//     // SendGrid does not provide a direct verification method like Nodemailer.
//     // You can add custom verification logic if needed.
//     console.log('SendGrid connection verified.');
//   }
// }

const emailProvider = process.env.EMAIL_PROVIDER || "nodemailer";

let emailService: EmailService;

if (emailProvider === "nodemailer") {
  emailService = new NodemailerService();
} else if (emailProvider === "sendgrid") {
  //emailService = new SendGridService();
} else {
  throw new Error(`Unsupported email provider: ${emailProvider}`);
}

export default emailService;
