import layoutHelpers from '@/layout/helpers.js';
import CommSidoCity from '@/common-sidocity.js';
import CommJohapDanjiShop from '@/common-johapdanjishop.js';

export default function () {
	let commSidoCty = new CommSidoCity();
	let commJohapDanjiShop = new CommJohapDanjiShop();

	return {
		// Layout helpers
		layoutHelpers,

		get codeSido() {
			return commSidoCty.codeSido;
		},
		get codeCity() {
			return commSidoCty.codeCity;
		},
		get codeJohap() {
			return commJohapDanjiShop.codeJohap;
		},
		get codeDanji() {
			return commJohapDanjiShop.codeDanji;
		},
		get codeShop() {
			return commJohapDanjiShop.codeShop;
		},

		// Check for RTL layout
		get isRTL() {
			return (
				document.documentElement.getAttribute('dir') === 'rtl' ||
				document.body.getAttribute('dir') === 'rtl'
			);
		},

		// Check if IE
		get isIE() {
			return typeof document['documentMode'] === 'number';
		},

		// Check if IE10
		get isIE10() {
			return this.isIE && document['documentMode'] === 10;
		},

		// Layout navbar color
		get layoutNavbarBg() {
			return 'navbar-theme';
		},

		// Layout sidenav color
		get layoutSidenavBg() {
			return 'sidenav-theme';
		},

		// Layout footer color
		get layoutFooterBg() {
			return 'footer-theme';
		},

		// Animate scrollTop
		scrollTop(
			to,
			duration,
			element = document.scrollingElement || document.documentElement,
		) {
			if (element.scrollTop === to) return;
			const start = element.scrollTop;
			const change = to - start;
			const startDate = +new Date();

			// t = current time; b = start value; c = change in value; d = duration
			const easeInOutQuad = (t, b, c, d) => {
				t /= d / 2;
				if (t < 1) return (c / 2) * t * t + b;
				t--;
				return (-c / 2) * (t * (t - 2) - 1) + b;
			};

			const animateScroll = () => {
				const currentDate = +new Date();
				const currentTime = currentDate - startDate;
				element.scrollTop = parseInt(
					easeInOutQuad(currentTime, start, change, duration),
				);
				if (currentTime < duration) {
					requestAnimationFrame(animateScroll);
				} else {
					element.scrollTop = to;
				}
			};

			animateScroll();
		},
	};
}
