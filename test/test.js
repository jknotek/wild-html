
const fs = require('fs');
const path = require('path');

require('colors');
const jsdiff = require('diff');

const { WildProcessor } = require('../wild-html.js');

var processor = new WildProcessor();
fs.createReadStream(path.join(__dirname, './test.whtml'))
	.pipe(processor)
	.pipe(fs.createWriteStream(path.join(__dirname, './test-out.html')))
	.on('finish', function () {
		runTests();
	});

function runTests() {
	var result   = fs.readFileSync(path.join(__dirname, './test-out.html')).toString();
	var expected = fs.readFileSync(path.join(__dirname, './test-out-expected.html')).toString();

	var diff = jsdiff.diffLines(expected, result)
		.filter((part) => {
			return part.added || part.removed;
		});

	if (diff.length == 0) {
		process.stdout.write(`✓ Tests pass\n\n`.green);
		return;
	}

	process.stderr.write(
		`❌ Tests fail! There are ${diff.length} mismatches with the expected output.\n\n`.red
		+ `Compare`.red
		+ ` test-out.html`.grey
		+ ` with`.red
		+ ` test-out-expected.html`.grey
		+ ` for more detailed information\n\n`.red
	);
}
