let data = {};
let fips = {};

fetch("./Data/data.json")
	.then(r => r.json())
	.then(d => { data = d; });
fetch("./Data/fips.json")
	.then(r => r.json())
	.then(d => { fips = d; });

function get(state, date) {
	if (isNaN(state)) state = fips[state];
	if (date) return data[state].on[date];
	return data[state];
}
function load(state, date, left, right) {
	state = get(state);
	let dates = Object.keys(state.on).sort();
	let x = [ 0 ];
	let y = [ 0 ];

	date = dates.findIndex(x => x == date);
	if (date === -1) return; // Invalid date

	// Daily cases
	for (var i = 1; i < dates.length; i++) {
		x.push(i);
		y.push(state.on[dates[i]].cases - state.on[dates[i - 1]].cases);
	}

	// Weekly average cases
	const span = 7;
	let sum = 0;
	let avg = [];
	for (var i = 0; i < span; i++) {
		sum += y[i];
		avg.push(sum / span);
	}
	for (var i = span; i < y.length; i++) {
		sum += y[i];
		sum -= y[i - span];
		avg.push(sum / span);
	}

	// Slice range
	left = Math.min(left, date);
	x2 = x.slice(0, left + right + 1);
	x = x.slice(0, left + 1);
	y = y.slice(date - left, date + 1);
	avg = avg.slice(date - left, date + 1);

	const miny = Math.min(...y);
	const maxy = Math.max(...y);
	const maxAvg = Math.max(...avg);

	const plot = (f, x, y, ...args) => f(x, y, x[0], x2.at(-1), miny, maxy, ...args);

	plot(graph, x, y, "#7af5");
	plot(gradientGraph, x, avg, maxAvg, 25);
}

let wait = setInterval(() => {
	if (Object.keys(data).length && Object.keys(fips).length) {
		clearInterval(wait);

		// Load New York by default
		load("New York", "2021-08-03", 14, 7);
	}
}, 500);
