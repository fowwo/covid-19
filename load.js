let data = {};
let fips = {};

let state = "New York";
let date = "2021-08-03";
let left = 21;
let right = 7;

// Estimate toggles
const linear = document.getElementById("linear");
const quadratic = document.getElementById("quadratic");
const cubic = document.getElementById("cubic");
const quartic = document.getElementById("quartic");
const quintic = document.getElementById("quintic");
const exp = document.getElementById("exponential");
const fivePoint = document.getElementById("fivepoint");
[ linear, quadratic, cubic, quartic, quintic, exp, fivePoint ].forEach(x => {
	x.addEventListener("click", e => {
		e.target.classList.toggle("toggled");
		clear();
		load(state, date, left, right);
		document.getElementById(`${x.id}-group`).style.display = e.target.classList.contains("toggled") ? "" : "none";
	});
});

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
	const actual = avg.slice(date + 1, date + 1 + right);
	left = Math.min(left, date);
	x2 = x.slice(0, left + right + 1);
	x = x.slice(0, left + 1);
	y = y.slice(date - left, date + 1);
	avg = avg.slice(date - left, date + 1);

	const maxAvg = Math.max(...avg);
	const miny = Math.min(...y, ...avg, ...actual);
	const maxy = Math.max(...y, ...actual, maxAvg);

	let v;
	const polynomial = (x) => v.reduce((sum, v, i) => sum + v * (x ** i), 0);
	const exponential = (x) => v[0] * (v[1] ** x);
	const plot = (f, x, y, ...args) => f(x, y, x[0], x2.at(-1), miny, maxy, ...args);

	plot(graph, x, y, "#7af5");
	graph(x2.slice(-right - 1), [avg.at(-1), ...actual], x[0], x2.at(-1), miny, maxy, "#fff8", 5, true);
	plot(gradientGraph, x, avg, maxAvg, 25);

	const x3 = x2.slice(-right);
	const diff = actual.length ? Math.round(actual.at(-1)) : Math.round(avg.at(-1));
	document.getElementById("actual-value").innerText = diff;
	if (isToggled(linear)) {
		v = leastSquaresPolynomial(x, avg, 1);
		plot(graph, x2, x2.map(polynomial), "#f00", 10, true);
		document.getElementById("linear-value").innerText = Math.round(polynomial(x2.at(-1)));
		document.getElementById("linear-difference").innerText = Math.round(polynomial(x2.at(-1))) - diff;
		document.getElementById("linear-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(polynomial), actual)) : "--";
	}
	if (isToggled(quadratic)) {
		v = leastSquaresPolynomial(x, avg, 2);
		plot(graph, x2, x2.map(polynomial), "#f80", 10, true);
		document.getElementById("quadratic-value").innerText = Math.round(polynomial(x2.at(-1)));
		document.getElementById("quadratic-difference").innerText = Math.round(polynomial(x2.at(-1))) - diff;
		document.getElementById("quadratic-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(polynomial), actual)) : "--";
	}
	if (isToggled(cubic)) {
		v = leastSquaresPolynomial(x, avg, 3);
		plot(graph, x2, x2.map(polynomial), "#ff0", 10, true);
		document.getElementById("cubic-value").innerText = Math.round(polynomial(x2.at(-1)));
		document.getElementById("cubic-difference").innerText = Math.round(polynomial(x2.at(-1))) - diff;
		document.getElementById("cubic-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(polynomial), actual)) : "--";
	}
	if (isToggled(quartic)) {
		v = leastSquaresPolynomial(x, avg, 4);
		plot(graph, x2, x2.map(polynomial), "#0f0", 10, true);
		document.getElementById("quartic-value").innerText = Math.round(polynomial(x2.at(-1)));
		document.getElementById("quartic-difference").innerText = Math.round(polynomial(x2.at(-1))) - diff;
		document.getElementById("quartic-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(polynomial), actual)) : "--";
	}
	if (isToggled(quintic)) {
		v = leastSquaresPolynomial(x, avg, 5);
		plot(graph, x2, x2.map(polynomial), "#0ff", 10, true);
		document.getElementById("quintic-value").innerText = Math.round(polynomial(x2.at(-1)));
		document.getElementById("quintic-difference").innerText = Math.round(polynomial(x2.at(-1))) - diff;
		document.getElementById("quintic-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(polynomial), actual)) : "--";
	}
	if (isToggled(exp)) {
		v = leastSquaresExponential(x, avg);
		plot(graph, x2, x2.map(exponential), "#66f", 10, true);
		document.getElementById("exponential-value").innerText = Math.round(exponential(x2.at(-1)));
		document.getElementById("exponential-difference").innerText = Math.round(exponential(x2.at(-1))) - diff;
		document.getElementById("exponential-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(exponential), actual)) : "--";
	}
	if (isToggled(fivePoint)) {
		v = fivePointEndpoint(avg.slice(-5));
		const f = (n) => v * (n - x.at(-1)) + avg.at(-1);
		plot(graph, x2, x2.map(f), "#f0f", 10, true);
		document.getElementById("fivepoint-value").innerText = Math.round(f(x2.at(-1)));
		document.getElementById("fivepoint-difference").innerText = Math.round(f(x2.at(-1))) - diff;
		document.getElementById("fivepoint-mse").innerText = actual.length >= right ? Math.round(meanSquaredError(x3.map(f), actual)) : "--";
	}
}
function isToggled(x) { return x.classList.contains("toggled"); }

let wait = setInterval(() => {
	if (Object.keys(data).length && Object.keys(fips).length) {
		clearInterval(wait);

		// Populate state dropdown
		let select = document.getElementById("state");
		Object.keys(fips).filter(isNaN).sort().forEach(x => {
			let option = document.createElement("option");
			option.value = x;
			option.innerText = x;
			if (x === state) option.selected = true;
			select.appendChild(option);
		});

		// Populate date dropdown
		select = document.getElementById("date");
		Object.keys(get("New York").on).sort().forEach(x => {
			let option = document.createElement("option");
			option.value = x;
			option.innerText = x;
			if (x === date) option.selected = true;
			select.appendChild(option);
		});
		
		load(state, date, left, right);
	}
}, 500);

document.getElementById("state").addEventListener("change", e => {
	clear();
	state = e.target.value;
	load(state, date, left, right);
});
document.getElementById("date").addEventListener("change", e => {
	clear();
	date = e.target.value;
	load(state, date, left, right);
});
document.getElementById("left").addEventListener("change", e => {
	clear();
	left = parseInt(e.target.value);
	load(state, date, left, right);
});
document.getElementById("right").addEventListener("change", e => {
	clear();
	right = parseInt(e.target.value);
	load(state, date, left, right);
});
