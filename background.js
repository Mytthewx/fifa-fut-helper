// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ea.com/pl-pl/fifa/ultimate-team/web-app/
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==


var $ = window.jQuery;

(function () {
	const APP_NAME = 'Mytthew Web App Helper';
	'use strict';

	// Search on transfermarket
	document.addEventListener('keypress', function (event) {
		if (event.key === 'b') {
			try {
				let playerNameInput = $(".ut-text-input-control");
				if (!playerNameInput.is(":focus")) {
					const searchButton = $("div.ut-market-search-filters-view .btn-standard.call-to-action")[0];
					tapElement(searchButton);
				}
			} catch (error) {
				log('Cant search on this view.', true /* isError */);
			}
		}
	});

	// Back from results to filters.
	document.addEventListener('keyup', function (event) {
		if (event.key === 'Backspace') {
			try {
				if (isSearchResultPage()) {
					const backButton = $("div.ut-navigation-bar-view .ut-navigation-button-control")[0];
					tapElement(backButton);
				}
			} catch (error) {
				log('You are not in search result view.', true /* isError */);
			}
		}
	});

	// Search and automate buy with confirmed popup.
	document.addEventListener('keypress', function (event) {
		if (event.key === 'm') {
			try {
				let playerNameInput = $(".ut-text-input-control");
				if (!playerNameInput.is(":focus")) {
					const searchButton = $("div.ut-market-search-filters-view .btn-standard.call-to-action")[0];
					tapElement(searchButton);
				}
				setTimeout(() => {
					const buyNowButton = $("div.bidOptions .btn-standard.buyButton")[0];
					console.log(buyNowButton);
					if (!buyNowButton.disabled) {
						tapElement(buyNowButton);
						confirmDialog();
					}
				}, 1000);
			} catch (error) {
				log(error, true /* isError */);
			}
		}
	})


	// Buy now and automate confirm popup.
	document.addEventListener('keypress', function (event) {
		if (event.key === 'n') {
			try {
				const buyNowButton = $("div.bidOptions .btn-standard.buyButton")[0];
				if (!buyNowButton.disabled) {
					tapElement(buyNowButton);
					confirmDialog();
				}
			} catch (error) {
				log('Unable to locate "Buy Now" button.', true /* isError */);
				return;
			}
		}
	});

	// Increase bid value.
	document.addEventListener('keydown', function (event) {
		if (event.key === 'o') {
			let playerNameInput = $(".ut-text-input-control");
			if (!playerNameInput.is(":focus")) {
				try {
					const increaseBid = $(".ut-numeric-input-spinner-control :nth-child(3)")[0];
					tapElement(increaseBid);
				} catch (error) {
					log('Unable to increase bid.', true /* isError */)
				}
			}
		}
	});

	// Decrease bid value.
	document.addEventListener('keydown', function (event) {
		if (event.key === 'i') {
			let playerNameInput = $(".ut-text-input-control");
			if (!playerNameInput.is(":focus")) {
				try {
					const decreaseBid = $(".ut-numeric-input-spinner-control :nth-child(1)")[0];
					tapElement(decreaseBid);
				} catch (error) {
					log('Unable to decrease bid.', true /* isError */)
				}
			}
		}
	});

	/* ---------- METHODS ---------- */

	function tapElement(element) {
		sendTouchEvent(element, 'touchstart');
		sendTouchEvent(element, 'touchend');
	}

	function sendTouchEvent(element, eventType) {
		const touchObj = new Touch({
			identifier: 'Keyboard shortcuts should be supported natively without an extension!',
			target: element,
			clientX: 0,
			clientY: 0,
			radiusX: 2.5,
			radiusY: 2.5,
			rotationAngle: 10,
			force: 0.5
		});

		const touchEvent = new TouchEvent(eventType, {
			cancelable: true,
			bubbles: true,
			touches: [touchObj],
			targetTouches: [touchObj],
			changedTouches: [touchObj],
			shiftKey: true
		});

		element.dispatchEvent(touchEvent);
	}

	function simulateKeyPress() {
		const popupOK = $(".ea-dialog-view button:nth-child(1)")[0];
		tapElement(popupOK);
	};

	function isSearchResultPage() {
		const title = $(".ut-pinned-list-container.SearchResults")[0];
		if (title != undefined) {
			return true;
		}
		return false;
	}

	function confirmDialog() {
		setTimeout(() => {
			try {
				simulateKeyPress();
			} catch (error) {
				log(error, true /* isError */);
			}
		}, getRandomWait());
	}

	function getRandomWait() {
		return Math.floor(Math.random() * (300 - 150)) + 150;
	}

	function log(message, isError) {
		let logFunction = console.info;

		if (isError) {
			logFunction = console.error;
		}

		logFunction(`${APP_NAME}: ${message}`)
	}
})();