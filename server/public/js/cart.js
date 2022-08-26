//*------ PARA MANEJO DE LISTA DE PRODUCTOS ------*//

const render_products = (current_products) => {
	const new_product = current_products
		.map((el) => {
			return `<tr>
        <td>${el.name}</td>
        <td>$${el.price}</td>
        <td>
            <img src=${el.thumbnail} width='50' height='50' alt=${el.name} />
        </td>
		<td>
			<button id="addItem" 
            class="btn-addToCart" 
            id-product=${el._id}
            type="button"></i>&#128722;</button>
		</td>
    </tr>`;
		})
		.join('');

	if (document.getElementById('prod-table')) {
		document.getElementById('prod-table').innerHTML = new_product;
	}
	return;
};

const send_new_product = () => {
	const name = document.getElementById('name').value;

	const price = Number(document.getElementById('price').value);

	const thumbnail = document.getElementById('thumbnail').value;

	const new_product = { name, price, thumbnail };

	socket.emit('new_product', new_product);
};

//*------ PARA MANEJO DE CARRITO ------*//

let cart = [];

let db_products = null;

window.addEventListener('load', (event) => {
	if (!localStorage.getItem('cart')) {
		localStorage.setItem('cart', '[]');
	}

	cart = JSON.parse(localStorage.getItem('cart'));
	render_cart();
});

socket.on('product-list', (currentProducts) => {
	if (currentProducts) {
		render_products(currentProducts);
		db_products = currentProducts;
	}
});

const render_cart = () => {
	const cart_items = cart
		.map((el) => {
			return `
        <tr>
            <td>
                <img src=${el.thumbnail} width='50' height='50' alt=${el.name} />
            </td>
            <td>${el.name}</td>
            <td>$${el.price}</td>
            <td>${el.qty}</td>
            <td>$${el.qty * el.price}</td>
		    <td>
			    <button id="addItem" 
                class="w3-button w3-xlarge w3-teal" 
                id-product=${el._id}
                type="button">+</button>
                <button id="deleteItem" 
                class="w3-button w3-xlarge w3-red w3-card-4" 
                id-product=${el._id}
                type="button">-</button>
		    </td>
        </tr>`;
		})
		.join('');

	if (document.getElementById('cart-table')) {
		document.getElementById('cart-table').innerHTML = cart_items;
	}
	return;
};

const addItemToCart = (item_id) => {
	let searched_product = null;

	// Si existe prod. en  la lista, guando los datos.
	for (i of db_products) {
		if (i._id === item_id) {
			searched_product = i;
		}
	}

	// Si no existe, termino la funcion.
	if (!searched_product) {
		return;
	}

	// Si el prod. ya existe en cart, aumento la cantidad en 1.
	for (i of cart) {
		if (i._id === item_id) {
			i.qty++;
			render_cart();
			localStorage.setItem('cart', JSON.stringify(cart));
			return;
		}
	}

	// Si el prod. no existe en cart, agrego la propiedad qty en 1.
	searched_product.qty = 1;
	// Guardo el objeto en cart.
	cart.push(searched_product);
	// Guardo los cambios en localStorage
	localStorage.setItem('cart', JSON.stringify(cart));
	render_cart();
};

const deleteItemFromCart = (item_id) => {
	const prod_index = cart.findIndex((el) => el._id === item_id);

	if (cart[prod_index].qty === 1) {
		cart.splice(prod_index, 1);
		render_cart();
		localStorage.setItem('cart', JSON.stringify(cart));
		return;
	}

	cart[prod_index].qty--;
	render_cart();
	localStorage.setItem('cart', JSON.stringify(cart));
	return;
};

const checkout = async (cart_data) => {
	await fetch('http://localhost:8080/api/cart/checkout', {
		method: 'POST',
		body: JSON.stringify({ cart: cart_data }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	localStorage.setItem('cart', '[]');
	cart = [];
	render_cart();
	return;
};

// Agrego un listener a todos los botones del fom product list.
const catalogue = document.getElementById('catalogue');

catalogue.addEventListener('click', (ev) => {
	ev.preventDefault();

	if (ev.target.id === 'addItem') {
		const prod_id = ev.target.attributes['id-product'].value;
		addItemToCart(prod_id);
	}
});

// Agergar o restar cantidad del producto desde carrito
const catalogue_cart = document.getElementById('catalogue-cart');

catalogue_cart.addEventListener('click', async (ev) => {
	ev.preventDefault();

	if (ev.target.id === 'addItem') {
		const prod_id = ev.target.attributes['id-product'].value;
		addItemToCart(prod_id);
		render_cart();
		return;
	}

	if (ev.target.id === 'deleteItem') {
		const prod_id = ev.target.attributes['id-product'].value;
		deleteItemFromCart(prod_id);
		return;
	}

	if (ev.target.id === 'checkout') {
		await checkout(cart);
		return;
	}
});
