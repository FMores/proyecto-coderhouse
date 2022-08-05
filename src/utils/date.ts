import moment from 'moment';

export const date_creator = () => {
	return new Promise<string>((resolve, reject) => {
		resolve(moment().format('DD-MM-YY hh:mm:ss a'));
	});
};
