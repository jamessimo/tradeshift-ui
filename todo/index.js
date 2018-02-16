/**
 * Initialize somehow. Let's just do it on DOMContentLoaded for now.
 */
addEventListener('DOMContentLoaded', () => {
	init(document.querySelectorAll('li'));
});

/**
 * Inject the arrows. They remain hidden until the secret message is posted.
 * @param {NodeList} items - these are the bullet points on the First Run page
 */
function init(items) {
	const arrows = Array.from(items).map(arrow);
	function paint(coords) {
		coords = coords || paint.coords;
		coords.forEach((y, i) => arrows[i](y, i));
		paint.coords ? void 0 : addEventListener('resize', () => paint());
		paint.coords = coords || paint.coords;
	}
	addEventListener('message', (e, data = e.data) => {
		const key = 'tradeshift-first-run-arrows:';
		if (data && data.charAt && data.startsWith(key)) {
			paint(JSON.parse(data.split(key)[1].trim()));
		}
	});
}

/**
 * Inject arrow. Returns a function that can be used 
 * to "anchor" the arrow next to the given element.
 * @param {Element} anchorelm
 * @returns {Function}
 */
function arrow(anchorelm) {
	const sns = 'http://www.w3.org/2000/svg';
	const doc = document.implementation.createDocument(null, null, null);
	const svg = document.querySelector('#arrows');
	const elm = svg.appendChild(doc.createElementNS(sns, 'g'));
	return (y, i) => {
		elm.innerHTML = connect(y, bounds(anchorelm), i);
		svg.classList.add('initialized');
	};
}

/**
 * Draw the arrow line(s). Returns an SVG string.
 * @param {number} y - arrow head y coordinate
 * @param {object} b - bounds of "anchor" element
 * @param {number} i - which one is it? 1, 2 or 3?
 * @returns {string}
 */
function connect(y, b, i) {
	const w = Math.min(innerWidth * 0.025, 44);
	const x = b.x * 0.5 + (i === 0 ? w : i === 2 ? 0 - w : 0);
	const points = [[33, y], [x, y], [x, y], [x, b.y], [x, b.y], [b.x, b.y]];
	return `
		<polyline points="${points.join(' ')}"/>
		<g transform="translate(22,${y - 7.75})">
			<g transform="scale(0.15)">
				<path d="M 5,50 97.5,5 97.5,95 Z"/>
			</g>
		</g>
	`;
}

/**
 * Compute coordinate for the arrow "anchor" element.
 * @param {Element} elm
 * @
 */
function bounds(elm) {
	const box = elm.getBoundingClientRect();
	return {
		y: box.top + box.height * 0.5,
		x: box.left
	};
}
