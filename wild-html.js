'use strict';

const { Transform } = require('stream');

const TAB = '\t';
const NEWLINE = '\n';

const VOID_ELEMENTS = [
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
];

class WildProcessor extends Transform {

	constructor(options) {
		super(options);

		this.openTags = [];
		this.tagLineRe = /^(\s*)\<\s*(\w+)/;
		this.lineSplit = '';
	}

	_transform(chunk, enc, cb) {
		var data = this.lineSplit + chunk.toString();
		var line = '';
		var char;
		for (var c=0; c<data.length; c++) {
			char = data[c];
			line += char;
			if (char == NEWLINE) {
				this.processLine(line);
				line = '';
			}
		}
		this.lineSplit = line;
		cb();
	}

	_flush(cb) {
		if (this.lineSplit) {
			this.processLine(this.lineSplit);
			this.lineSplit = '';
		}
		this.flushOpenTags(0);
		cb();
	}

	/**
	 * Process a line of input, closing open tags as necessary keeping track of a
	 * new tag if one exists.
	 *
	 * @param {string} line
	 */
	processLine(line) {
		var match = this.tagLineRe.exec(line);
		if (match) {
			var indentLevel = match[1].length;
			var tagName = match[2];
			this.flushOpenTags(indentLevel);

			// void elements shouldn't have a closing tag
			if (!VOID_ELEMENTS.includes(tagName.toLowerCase())) {
				this.openTags.push({
					tagName,
					indentLevel,
				});
			}
		}
		this.push(line);
	}

	/**
	 * Writes closing tags for all open tags that are expecting an indent greater
	 * than the given `indentLevel`.
	 *
	 * @param {number} indentLevel
	 */
	flushOpenTags(indentLevel) {
		for (var i=this.openTags.length-1; i>=0; i--) {
			var tag = this.openTags[i];
			if (!tag) continue;
			if (tag.indentLevel >= indentLevel) {
				this.push(TAB.repeat(tag.indentLevel) + `</${tag.tagName}>\n`);
				delete this.openTags[i];
			}
		}
	}

}

module.exports.WildProcessor = WildProcessor;
