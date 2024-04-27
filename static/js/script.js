import { data } from './data.js';
import {
	changeLinkColor,
	changeTitle,
	fillContent,
	toggleCart,
	toggleWhishlist,
} from './helpers.js';

changeTitle('Electronics store');
changeLinkColor('home');

const mainSection = document.getElementById('main-section');

let wishlistArr = JSON.parse(localStorage.getItem('wishlist')) || [];

let cart = JSON.parse(localStorage.getItem('cart')) || {
	totalPrice: 0,
	products: [],
};

//* display the items in the wishlist array with the red emotion
if (wishlistArr.length > 0) {
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < wishlistArr.length; j++) {
			if (wishlistArr[j].id === data[i].id) {
				data[i].wishlisted = true;
			}
		}
	}
}

//* display the items in the cart products array with remove button
if (cart.products.length > 0) {
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < cart.products.length; j++) {
			if (cart.products[j].id === data[i].id) {
				data[i].addedToCart = true;
			}
		}
	}
}

const homeContent = fillContent(data);

mainSection.innerHTML = homeContent;

toggleWhishlist(data, wishlistArr);

toggleCart(data, cart);

//* Implementing search
const search = document.getElementById('search');

search.addEventListener('change', () => {
	const query = search.value;
	const resultArr = [];
	for (let i = 0; i < data.length; i++) {
		if (data[i].title.toLowerCase().includes(query.toLowerCase())) {
			resultArr.push(data[i]);
		}
	}

	if (resultArr.length > 0) {
		const homeContent = fillContent(resultArr);
		mainSection.innerHTML = homeContent;
	} else if (query === '') {
		const homeContent = fillContent(data);
		mainSection.innerHTML = homeContent;
	} else {
		mainSection.innerHTML = '<p class="empty-text">Not found</p>';
	}

	toggleWhishlist(mainSection, data, wishlistArr);
	toggleCart(data, cart);
});
