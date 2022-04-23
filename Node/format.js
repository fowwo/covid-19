/**
 * A Node.js program to reformat the NYT data
 * for easier use on the web page.
 * 
 * @author fowwo
 */

const fs = require("fs");
const nyt = JSON.parse(fs.readFileSync(`${__dirname}/../Data/nyt.json`, "utf8"));

let data = {}
for (var x of nyt) {
	let fips = parseInt(x.fips);
	if (!data[fips]) data[fips] = { state: x.state, on: {} };
	data[fips].on[x.date] = { cases: parseInt(x.cases), deaths: parseInt(x.deaths) };
}
fs.writeFileSync(`${__dirname}/../Data/data.json`, JSON.stringify(data) + '\n');
