import { changeLinkColor, changeTitle } from './helpers.js';

changeTitle('Orders');
changeLinkColor('orders');

const orders = JSON.parse(localStorage.getItem('orders')) || [];
const cart = JSON.parse(localStorage.getItem('cart'));
const ordersMain = document.getElementById('orders-main');
let content = '';

if (cart?.products.length > 0) {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const formattedDate = `${day < 10 ? '0' + day : day}/${
		month < 10 ? '0' + month : month
	}/${year}`;
	cart.date = formattedDate;
	orders.push(cart);
	localStorage.removeItem('cart');
	localStorage.setItem('orders', JSON.stringify(orders));
}

if (orders.length > 0) {
	for (let i = 0; i < orders.length; i++) {
		for (let j = 0; j < orders[i].products.length; j++) {
			content += `<div class='card'>
                <div class="img-container">
                    <img class='card-img' src=${orders[i].products[j].thumbnail} alt='product-img' />
                </div>
                <div class='card-text'>
                    <p class='title'>${orders[i].products[j].title}</p>
                    <p class='price'>${orders[i].products[j].price}$</p>
                    <p class ='date'>${orders[i].date}</p>
                </div>
            </div>`;
		}
	}

	ordersMain.innerHTML = content;
} else {
	ordersMain.innerHTML = '<p class ="empty-text">No orders yet</p>';
}
