import {
	changeLinkColor,
	changeTitle,
	fillContent,
	toggleCart,
} from './helpers.js';

changeTitle('Wishlist');
changeLinkColor('wishlist');

let wishlistArr = JSON.parse(localStorage.getItem('wishlist'));
const wishlistMain = document.getElementById('wishlist-main');
let cart = JSON.parse(localStorage.getItem('cart')) || {
	totalPrice: 0,
	products: [],
};

// //* display the items in the cart products array with remove button
if (cart.products?.length > 0 && wishlistArr.length > 0) {
	for (let i = 0; i < cart.products.length; i++) {
		for (let j = 0; j < wishlistArr.length; j++) {
			if (cart.products[i].id === wishlistArr[j].id) {
				wishlistArr[j].addedToCart = true;
			}
		}
	}
} else {
	for (let i = 0; i < wishlistArr.length; i++) {
		wishlistArr[i].addedToCart = false;
	}
}

//* display items if exist else display descriptive text
if (wishlistArr?.length > 0) {
	let wishlistContent = fillContent(wishlistArr);
	wishlistMain.innerHTML = wishlistContent;
} else {
	wishlistMain.innerHTML = '<p class ="empty-text">Wishlist is empty</p>';
}

const cards = document.getElementsByClassName('card');

//* delete items from wishlist and local storage
for (let i = 0; i < cards.length; i++) {
	const wishlistBtn = cards[i].querySelector('#wishlist-btn');
	wishlistBtn.addEventListener('click', function (e) {
		const id = +e.target.closest('.card').getAttribute('data-id');
		const card = e.target.closest('.card');
		card.remove();
		const modifiedArr = wishlistArr.filter((el) => el.id !== id);
		wishlistArr = modifiedArr;
		if (wishlistArr.length === 0) {
			wishlistMain.innerHTML = '<p class ="empty-text">Wishlist is empty</p>';
		}
		localStorage.setItem('wishlist', JSON.stringify(wishlistArr));
	});
}

//* Add to cart functionality
toggleCart(wishlistArr, cart);
