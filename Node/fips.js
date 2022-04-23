/**
 * A Node.js program to map each state to its FIPS code
 * and each FIPS code to its state.
 * 
 * @author fowwo
 */

const fs = require("fs");
const nyt = JSON.parse(fs.readFileSync(`${__dirname}/../Data/nyt.json`, "utf8"));

let data = {}
for (var x of nyt) {
	let fips = parseInt(x.fips);
	data[fips] = x.state;
	data[x.state] = fips;
}
fs.writeFileSync(`${__dirname}/../Data/fips.json`, JSON.stringify(data) + '\n');
