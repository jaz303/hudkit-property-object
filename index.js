var signal = require('signalkit');

module.exports = function() {
	return new PropertyObject();
}

function PropertyObject() {
	
	this._values 		= {};
	this._groups 		= [];
	this._properties	= {};

	// onChange is exposed for convenience only, the official interface
	// (for use in a PropertyEditor widget) is onPropertyChange(fn)
	this.onChange = signal('onChange');

}

PropertyObject.prototype.group = function(title) {

	var po 		= this,
		gix		= this._groups.length,
		names 	= [];

	var group = {
		title: title,
		propertyNames: names,
		add: function(name, type, initialValue, options) {

			if (name in po._properties) {
				throw new Error("duplicate property: " + name);
			}

			options = options || {};
			options.type = type;

			if (!('caption' in options)) {
				// TODO: humanize name
				options.caption = name;
			}

			names.push(name);
			po._values[name] = initialValue;
			po._properties[name] = options;

			return this;

		},
		back: function() {
			return po;
		}
	};

	this._groups.push(group);

	return group;

}

PropertyObject.prototype.getPropertyGroupCount = function() {
	return this._groups.length;
}

PropertyObject.prototype.getPropertyGroupTitle = function(groupIx) {
	return this._groups[groupIx].title;
}

PropertyObject.prototype.getPropertyNames = function(groupIx) {
	return this._groups[groupIx].propertyNames;
}

PropertyObject.prototype.getPropertyDescriptor = function(name) {
	return this._properties[name];
}

PropertyObject.prototype.getPropertyValue = function(key) {

	if (!(key in this._values)) {
		throw new Error("no such property: " + key);
	}

	return this._values[key];

}

PropertyObject.prototype.setPropertyValue = function(key, newValue) {

	if (!(key in this._values)) {
		throw new Error("no such property: " + key);
	}

	var oldValue = this._values[key];
	
	this._values[key] = newValue;
	
	this.onChange.emit(this, {
		property 	: key,
		oldValue	: oldValue,
		newValue	: newValue,
		values 		: this._values
	});

	return true;

}

PropertyObject.prototype.onPropertyChange = function(cb) {
	return this.onChange.connect(cb);
}

// again, these are just convenience methods for the end-user; not part
// of the official PropertyEditor delegate interface
PropertyObject.prototype.get = PropertyObject.prototype.getPropertyValue;
PropertyObject.prototype.set = PropertyObject.prototype.setPropertyValue;
