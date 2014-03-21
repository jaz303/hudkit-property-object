# hudkit-property-object

`hudkit-property-object` implements a convenience interface for setting up 2-way bindings between a dictionary of values and a `hudkit` property editor widget.

## Install

	$ npm install hudkit-property-object

## Usage

```javascript
var hpo = require('hudkit-property-object');

var obj = hpo();

obj.group('User Details')
		.add('forename', 'Jason', {
			type: 'text',
			caption: 'Forename'
		})
		.add('surname', 'Frame', {
			type: 'text',
			caption: 'Surname'
		})
		.back()
	.group('Settings')
		.add('enabled', false, {
			type: 'checkbox',
			caption: 'Account enabled?'
		})

obj.get('forename') // => 'Jason'
obj.get('enabled') // => false

obj.onChange.connect(function(evt) {
	console.log(evt);
});
```