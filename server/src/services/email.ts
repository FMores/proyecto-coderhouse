import Config from '../config';
import nodemailer from 'nodemailer';

class Email {
	private transporter: any;
	constructor() {
		/* GMAIL TRANSPORTER - OWNER DATA */
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: Config.GMAIL_OWNER_ADRESS,
				pass: Config.GMAIL_OWNER_PASSWORD,
			},
		});
	}

	async sendEmail(dest: String, subject: String, content: String) {
		const mailOptions = {
			from: Config.GMAIL_OWNER_ADRESS,
			to: dest,
			subject,
			html: content,
		};

		const response = await this.transporter.sendMail(mailOptions);
		return response;
	}
}

export const EmailService = new Email();
