function leastSquaresPolynomial(x, y, degree) {
	let xs = [ x.length ];
	let xys = [ y.reduce((sum, x) => sum + x, 0) ];
	for (var n = 1; n <= 2 * degree; n++) {
		xs.push(0);
		for (var i = 0; i < x.length; i++) {
			xs[xs.length-1] += x[i] ** n;
		}
	}
	for (var n = 1; n <= degree; n++) {
		xys.push(0);
		for (var i = 0; i < x.length; i++) {
			xys[xys.length-1] += (x[i] ** n) * y[i];
		}
	}

	let M = [];
	for (var i = 0; i <= degree; i++) {
		let row = [];
		for (var j = 0; j <= degree; j++) {
			row.push(xs[i + j]);
		}
		M.push(row);
	}

	M = new Matrix(M);
	detM = M.determinant();
	let coefficients = [];
	for (var i = 0; i <= degree; i++) {
		let matrix = M.copy();
		matrix.setColumn(i, xys);
		coefficients.push(matrix.determinant() / detM);
	}
	return coefficients;
}
function leastSquaresExponential(x, y) {
	return leastSquaresPolynomial(x, y.map(Math.log), 1).map(Math.exp);
}
function fivePointEndpoint(y) {
	return (-1/12) * (-25 * y[4] + 48 * y[3] - 36 * y[2] + 16 * y[1] - 3 * y[0]);
}
function meanSquaredError(observed, predicted) {
	return observed.reduce((sum, v, i) => sum + (v - predicted[i]) ** 2, 0) / observed.length;
}
