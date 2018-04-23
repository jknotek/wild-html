
# Wild HTML
HTML with wild, unclosed tags. Saving you keystrokes — one unnecessary
dependency at a time. 😉

Closing tags are a thing of the past. Use responsible indentation instead, like
[Pug](https://github.com/pugjs/pug):

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Wild Huh?
	<body>
		<div class="wrapper">
			<div class="stuff">
				<h2>Why even bother?
				<ol>
					<li>Cut your tag management in half.
					<li>Add another dependency to your project.
					<li>...There's really no point 😅
```

Yes, that's the full snippet (I know, it's weird at first). The Wild HTML
processor will expand the above code into:

```html
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Wild Huh?
		</title>
	</head>
	<body>
		<div class="wrapper">
			<div class="stuff">
				<h2>Why even bother?
				</h2>
				<ol>
					<li>Cut your tag management in half.
					</li>
					<li>Add another dependency to your project.
					</li>
					<li>...There's really no point 😅
					</li>
				</ol>
			</div>
		</div>
	</body>
</html>
```

Yuck! Aren't you glad you've made the switch to Wild tags?

## Using
So far, it's just a simple library that uses Node streams. You can import the
processor and use it like so:

```js
const fs = require('fs');
const { WildProcessor } = require('./wild-html.js');

var processor = new WildProcessor();
fs.createReadStream('./index.whtml')
	.pipe(processor)
	.pipe(fs.createWriteStream('./index.html'));

```

## Known Issues
### Only works with tabs at the moment.

### Doesn't see manually closed tags.

```html
<title>I closed this tag by myself!</title>
```

will be translated into

```html
<title>I closed this tag by myself!</title>
</title>
```

## License
**ISC** (see LICENSE file)
