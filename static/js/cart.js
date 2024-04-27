import { changeLinkColor, changeTitle } from './helpers.js';

changeTitle('Cart');
changeLinkColor('cart');

let cart = JSON.parse(localStorage.getItem('cart'));
const cartMain = document.getElementById('cart-main');

if (cart?.products?.length > 0) {
	const cartArr = cart.products;
	let content = '';

	for (let i = 0; i < cartArr.length; i++) {
		content += `<div class='card' data-id=${cartArr[i].id}>
        <div class="img-container">
            <img class='card-img' src=${cartArr[i].thumbnail} alt='product-img' />
        </div>
        <div class='card-text'>
            <h3 class='title'>${cartArr[i].title}</h3>
            <p class='card-desc'>${cartArr[i].description}</p>
            <p class='price'>${cartArr[i].price}$</p>
        </div>
        <div class='btns'>
            <button id='delete-btn' class='card-btn'>Remove</button>
        </div>
    </div>`;
	}
	cartMain.innerHTML = content;
	cartMain.innerHTML += `<p id='total-price' >${cart.totalPrice}$</p>
    <form action='/info' method='get'><button id = "order-btn">Check out<button></form> 
    `;
} else {
	cartMain.innerHTML = '<p class ="empty-text">Cart is empty</p>';
}

const cards = document.getElementsByClassName('card');
const priceEl = document.getElementById('total-price');

for (let i = 0; i < cards.length; i++) {
	const removeBtn = cards[i].querySelector('#delete-btn');
	removeBtn.addEventListener('click', function (e) {
		const id = +e.target.closest('.card').getAttribute('data-id');
		const card = e.target.closest('.card');
		card.remove();
		for (let j = 0; j < cart.products.length; j++) {
			if (id === cart.products[j].id) {
				cart.totalPrice -= cart.products[j].price;
			}
		}
		priceEl.textContent = `${cart.totalPrice}$`;
		const modifiedArr = cart.products.filter((el) => el.id !== id);
		cart.products = modifiedArr;
		if (cart.products.length === 0) {
			cartMain.innerHTML = '<p class ="empty-text">Cart is empty</p>';
		}
		localStorage.setItem('cart', JSON.stringify(cart));
	});
}
