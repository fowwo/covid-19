class Matrix {
	constructor(array) {
		this.values = array;
		this.rows = this.values.length;
		this.columns = (this.rows ? this.values[0].length : 0);
	}

	get(row, column) { return this.values[row][column]; }
	set(row, column, value) { this.values[row][column] = value; }
	copy() { return new Matrix(this.values.map(x => x.slice())); }

	setRow(i, row) {
		if (row.length !== this.columns) throw new Error("The number of elements does not match the row length.");
		this.values[i] = row.slice();
	}
	setColumn(i, column) {
		if (column.length !== this.rows) throw new Error("The number of elements does not match the column length.");
		for (var j = 0; j < this.rows; j++) this.values[j][i] = column[j];
	}
	deleteRow(i) {
		this.rows--;
		return this.values.splice(i, 1)[0];
	}
	deleteColumn(i) {
		let column = [];
		this.values.map(x => {
			let v = x.splice(i, 1)[0];
			column.push(v);
			return v;
		});
		this.columns--;
		return column;
	}

	add(matrix) {
		if (this.rows !== matrix.rows || this.columns !== matrix.columns)
			throw new Error(`Cannot add ${this.rows}x${this.columns} and ${matrix.rows}x${matrix.columns} matrices.`);
		let m = Matrix.zero(this.rows, this.columns);
		for (var r = 0; r < this.rows; r++) {
			for (var c = 0; c < this.columns; c++) {
				m.set(r, c, this.get(r, c) + matrix.get(r, c));
			}
		}
		return m;
	}
	multiply(matrix) {
		if (this.columns !== matrix.rows)
			throw new Error(`Cannot multiply ${this.rows}x${this.columns} and ${matrix.rows}x${matrix.columns} matrices.`);
		let m = Matrix.zero(this.rows, matrix.columns);
		for (var r = 0; r < this.rows; r++) {
			for (var c = 0; c < matrix.columns; c++) {
				let v = 0;
				for (var i = 0; i < this.columns; i++) {
					v += this.get(r, i) * matrix.get(i, c);
				}
				m.set(r, c, v);
			}
		}
		return m;
	}

	determinant() {
		if (this.rows !== this.columns) throw new Error("Cannot calculate the determinant of a non-square matrix.");
		let matrix = this.copy();
		let det = 1;
		for (var i = 0; i < matrix.rows - 1; i++) {
			// Swap
			if (matrix.get(i, i) === 0) {
				let swapped = false;
				for (var j = i + 1; j < matrix.rows; j++) {
					if (matrix.get(j, i)) {
						let t = matrix.values[i].slice();
						matrix.setRow(i, matrix.values[j]);
						matrix.setRow(j, t);
						det *= -1;
						swapped = true;
						break;
					}
				}
				if (!swapped) continue;
			}

			// Eliminate
			for (var j = i + 1; j < matrix.rows; j++) {
				let ratio = matrix.get(j, i) / matrix.get(i, i);
				for (var k = i; k < matrix.columns; k++) {
					matrix.set(j, k, matrix.get(j, k) - ratio * matrix.get(i, k));
				}
			}
		}

		// Multiply along diagonal
		for (var i = 0; i < matrix.rows; i++) {
			det *= matrix.get(i, i);
		}
		return det;
	}

	static zero(rows, columns) {
		let matrix = [];
		let row = [];
		for (var i = 0; i < columns; i++) row.push(0);
		for (var i = 0; i < rows; i++) matrix.push(row.slice());
		return new Matrix(matrix);
	}
	static identity(n) {
		let matrix = Matrix.zero(n, n);
		for (var i = 0; i < n; i++) matrix.set(i, i, 1);
		return matrix;
	}
	static column(list) {
		let column = [];
		for (var value of list) column.push([ value ]);
		return new Matrix(column);
	}

	toString() {
		let string = "";
		for (var i = 0; i < this.rows; i++) string += this.values[i].join(" ") + '\n';
		return string.substring(0, string.length - 1);
	}
}
