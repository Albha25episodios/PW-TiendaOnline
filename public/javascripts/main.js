const modulosDB = require('./libreria');
const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

/* ========================= */
const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

// Lista de todos los contenedores de productos
const productsList = document.querySelector('.container-items');

// Variable de arreglos de Productos
let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
			const products = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});
			allProducts = [...products];
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('p').textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		console.log(allProducts);

		showHTML();
	}
});

// Funcion para mostrar  HTML
const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
	}

	// Limpiar HTML
	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + parseInt(product.quantity * product.price.slice(4));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `S/. ${total.toFixed(2)}`;
	countProducts.innerText = totalOfProducts;
};

productsList.addEventListener('click', async e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;
		const productInfo = {
			title: product.querySelector('h2').textContent,
			price: parseFloat(product.querySelector('p').textContent.slice(4)),
			quantity: 1
		};

		try {
			const basedatos = modulosDB.conectar;
			const DNICliente = req.session.DNICliente;
			const reservationQuery = 'INSERT INTO tReserva (IDReserva, DNICliente, Fecha) VALUES (?, ?, ?)';
			const reservationValues = ['RE001', DNICliente, new Date()];

			await basedatos.query(reservationQuery, reservationValues);

			// Obtener el ID de la reserva recién insertada
			//const [reservationResult] = await basedatos.query('SELECT * FROM tReserva ORDER BY id DESC LIMIT 1;');
			//const reservationID = reservationResult[0].IDReserva;

			// Insertar los detalles de reserva en la tabla tReserva_detalle
			const reservationDetailQuery = 'INSERT INTO tReserva_detalle (IDReserva, IDProducto, Cantidad) VALUES (?, ?, ?)';
			
			// Insertar cada producto en el carrito como un detalle de reserva
			for (const productInCart of allProducts) {
				const detailValues = ['RE001', productInCart.productID, productInCart.quantity];
				await basedatos.query(reservationDetailQuery, detailValues);
			}

			console.log('Productos reservados y guardados en la base de datos.');

		} catch (error) {
			console.error('Error en la operación:', error);
		}
	}
});
