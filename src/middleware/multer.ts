import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';

const imagesFolderPath = path.resolve(__dirname, '../../public/images');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, imagesFolderPath);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('_');
		cb(null, fileName);
	},
});

export const upload_single_img = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	},
}).single('profile_picture');

export const multer_check_img = (req: Request, res: Response, next: NextFunction) => {
	const singleFile = req.file;
	if (!singleFile) {
		req.statusCode = 400;
		res.send({ Error: 'You must select an image to save' });
		return;
	}
	next();
};
