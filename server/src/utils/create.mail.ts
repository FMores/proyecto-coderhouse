import config from '../config';
import { Imail_content, IMail_creator } from 'src/config/interfaces';

export const mail_creator = (user_data: IMail_creator) => {
	const { full_name, adress, age, phone_number, email } = user_data;

	const destination = config.GMAIL_OWNER_ADRESS;
	const subject = 'A new user has logged in';
	const content = `
    <h1>Hello ${config.GMAIL_OWNER_NAME}!</h1>
    <br />
    <p>A new user has logged into your e-commerce.</p>
    <br />
    <table>
        <th>New user data:</th>
        <tr>
            <td>Full Name:</td>
            <td>${full_name}</td>
        </tr>
        <tr>
            <td>Adress:</td>
            <td>${adress}</td>
        </tr>
        <tr>
            <td>Age:</td>
            <td>${age}</td>
        </tr>
        <tr>    
            <td>Phone Number:</td>
            <td>${phone_number}</td>
        </tr>
        <tr>
            <td>Email:</td>
            <td>${email}</td>
        </tr>
    </table>
    `;

	return new Promise<Imail_content>((resolve, reject) => {
		resolve({
			destination,
			subject,
			content,
		});
	});
};
