export function fillContent(data) {
	let content = '';
	for (let i = 0; i < data.length; i++) {
		content += `<div class='card' data-id=${data[i].id}>
        <div class="img-container">
            <img class='card-img' src=${data[i].thumbnail} alt='product-img' />
        </div>  
        <div class='card-text'>
            <h3 class='title'>${data[i].title}</h3>
            <p class='card-desc'>${data[i].description}</p>
            <p class='price'>${data[i].price}$</p>
        </div>
        <div class='btns'>
            <button id='cart-btn' class='card-btn'> ${
							data[i].addedToCart ? 'Remove from cart' : 'Add to cart'
						} </button>
            <button id='wishlist-btn' class='wishlist ${
							data[i].wishlisted && 'wishlisted'
						}'>❤</button>
        </div>
    </div>`;
	}

	return content;
}

export function toggleWhishlist(data, wishlistArr) {
	const cards = document.getElementsByClassName('card');

	//* Add,remove items to wishlist
	for (let i = 0; i < cards.length; i++) {
		const wishlistBtn = cards[i].querySelector('#wishlist-btn');

		wishlistBtn.addEventListener('click', function (e) {
			const id = +e.target.closest('.card').getAttribute('data-id');
			for (let j = 0; j < data.length; j++) {
				if (id === data[j].id) {
					data[j].wishlisted = !data[j].wishlisted;
					wishlistBtn.classList.toggle('wishlisted');
					if (data[j].wishlisted) {
						wishlistArr.push(data[j]);
					} else {
						const modifiedArr = wishlistArr.filter(
							(el) => el.id !== data[j].id
						);
						wishlistArr = modifiedArr;
					}
				}
			}
			localStorage.setItem('wishlist', JSON.stringify(wishlistArr));
		});
	}
}

//* add items to cart

export function toggleCart(data, cart) {
	const cards = document.getElementsByClassName('card');

	for (let i = 0; i < cards.length; i++) {
		const cartBtn = cards[i].querySelector('#cart-btn');
		cartBtn.addEventListener('click', function (e) {
			const id = +e.target.closest('.card').getAttribute('data-id');

			for (let j = 0; j < data.length; j++) {
				if (data[j].id === id) {
					data[j].addedToCart = !data[j].addedToCart;
					localStorage.setItem('cart', JSON.stringify(cart));
					if (data[j].addedToCart) {
						cartBtn.textContent = 'Remove from cart';
						cart.products.push(data[j]);
						cart.totalPrice += data[j].price;
					} else {
						cartBtn.textContent = 'Add to cart';
						const modifiedArr = cart.products.filter(
							(el) => el.id !== data[j].id
						);
						cart.products = modifiedArr;
						cart.totalPrice -= data[j].price;
					}
				}
			}
			localStorage.setItem('cart', JSON.stringify(cart));
		});
	}
}

//* change title of the page
export function changeTitle(text) {
	document.title = text;
}

//* change color of link on active section
export function changeLinkColor(id) {
	const navLink = document.getElementById(id);
	navLink.style.color = '#06a3da';
}
