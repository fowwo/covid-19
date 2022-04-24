const ctx = document.getElementById("graph").getContext("2d");
resetStroke();

function map(x, a1, b1, a2, b2) { return (x - a1) / (b1 - a1) * (b2 - a2) + a2; }
function graph(x, y, xa, xb, ya, yb, color, weight = 10, dashed = false) {
	const m = (i) => [ map(x[i], xa, xb, 0, 4000), 3000 - map(y[i], ya, yb, 100, 2900) ];
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = weight;
	if (dashed) ctx.setLineDash([50, 50]);
	ctx.moveTo(...m(0));
	for (var i = 1; i < x.length; i++) {
		ctx.lineTo(...m(i));
	}
	ctx.stroke();
	resetStroke();
}
function gradientGraph(x, y, xa, xb, ya, yb, max, weight = 10) {
	const m = (i) => [ map(x[i], xa, xb, 0, 4000), 3000 - map(y[i], ya, yb, 100, 2900) ];
	for (var i = 1; i < x.length; i++) {
		ctx.beginPath();
		ctx.lineWidth = weight;
		ctx.moveTo(...m(i-1));
		ctx.lineTo(...m(i));
		let color = Math.round(255 * map((y[i-1] + y[i])/2, ya, max, 0, 1));
		ctx.strokeStyle = `rgb(${Math.max(Math.min(2 * color, 255), 0)},${Math.max(Math.min(2 * (255 - color), 255), 0)},0)`;
		ctx.stroke();
	}
	resetStroke();
}
function resetStroke() {
	ctx.strokeStyle = "#fff";
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.lineWidth = 20;
	ctx.setLineDash([]);
}
function clear() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
