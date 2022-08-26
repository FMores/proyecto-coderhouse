//*------ PARA EL MANEJO DE LOGIN ------*//

const logout_function = () => {
	window.location.href = '/api/auth/logout';
};

const error_timer = () => {
	setTimeout(() => {
		window.location.href = '/api/auth/login';
	}, 3000);
};
