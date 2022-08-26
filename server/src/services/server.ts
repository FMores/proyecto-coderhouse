import { errorHandler } from '../middleware/errorHandler';
import { session_config } from '../middleware';
import { create } from 'express-handlebars';
import indexRouter from '../routes/index';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import passport from 'passport';
import config from '../config';
import { Server } from 'http';
import express from 'express';
import path from 'path';

export const app = express();

//Configuracion de Handlebars
export const hbs = create({
	extname: 'hbs',
	layoutsDir: path.resolve(__dirname, '../../views/layouts'),
	defaultLayout: path.resolve(__dirname, '../../views/layouts/main'),
	partialsDir: path.resolve(__dirname, '../../views/partial'),
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../../views'));

// Haciendo disponible la carpeta public
app.use(express.static(path.resolve(__dirname, '../../public')));

//Middlewares basicos necesarios.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser(config.COOKIE_PARSER_SECRET));
app.use(session_config);
app.use(passport.initialize());
app.use(passport.session());

//Configurando rutas
app.use('/api', indexRouter);

//Manejo de errores
app.use(errorHandler);

// Creamos un servidor con http para poder utilizar socket junto a express y lo exportamos
export const httpServer = new Server(app);
