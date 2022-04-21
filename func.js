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
		matrix.setColumn(degree - i, xys);
		coefficients.push(matrix.determinant() / detM);
	}
	return coefficients;
}