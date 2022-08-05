const socket = io.connect();

//*------ PARA MANEJO DE CHAT ------*//

const renderMsg = (currentMsg) => {
	let newTextArea = currentMsg
		.map((el) => {
			return `<div >
            <div class="el-author">${el.author.email}</div>
            <div class="el-timestamp">[${el.timestamp}]:</div>
            <p class="el-text">${el.text} <img width="20" height="20" src=${el.author.avatar}></p>
            </div>`;
		})
		.join('');

	if (document.getElementById('textarea')) {
		document.getElementById('textarea').innerHTML = newTextArea;
		document.getElementById('textarea').scrollTop = document.getElementById('textarea').scrollHeight;
	}
	return;
};

const sendMessage = () => {
	var select = document.getElementById('language');
	var avatar = select.options[select.selectedIndex].value;

	const new_msg = {
		email: document.getElementById('email').value,
		name: document.getElementById('name2').value,
		surname: document.getElementById('surname').value,
		age: document.getElementById('age').value,
		alias: document.getElementById('alias').value,
		avatar: avatar,
		text: document.getElementById('msg').value,
	};

	for (let value in new_msg) {
		if (new_msg[value] === '') {
			alert(`Debes completar todos los campos para poder enviar el mensaje`);
			return;
		}
	}

	socket.emit('new-msg', new_msg);

	return;
};

socket.on('mensajes', (currentMsg) => {
	if (currentMsg) {
		renderMsg(currentMsg);
	}
});
