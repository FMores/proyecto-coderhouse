import { v4 } from 'uuid';

export const code_creator = () => {
	return new Promise<string>((resolve, reject) => {
		resolve(v4());
	});
};
