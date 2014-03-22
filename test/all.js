var po      = require('../'),
    test    = require('tape');

function makeTestObject() {

    var obj = po();

    obj.group('G1')
            .add('foo', 'text', 10)
            .add('bar', 'checkbox', false, {caption: 'Bar'})
            .back()
        .group('G2')
            .add('baz', 'slider', 50, {a: 1, b: 2, c: 3});

    return obj;

}

test('#getPropertyGroupCount', function(a) {
    var obj = makeTestObject();
    a.equal(2, obj.getPropertyGroupCount());
    a.end();
});

test('#getPropertyGroupTitle', function(a) {
    var obj = makeTestObject();
    a.equal('G1', obj.getPropertyGroupTitle(0));
    a.equal('G2', obj.getPropertyGroupTitle(1));
    a.end();
});

test('#getPropertyNames', function(a) {
    var obj = makeTestObject();
    a.deepEqual(['foo','bar'], obj.getPropertyNames(0));
    a.deepEqual(['baz'], obj.getPropertyNames(1));
    a.end();
});

test('#getPropertyDescriptor', function(a) {
    var obj = makeTestObject();
    a.deepEqual(['foo','bar'], obj.getPropertyNames(0));
    a.deepEqual({
        type: 'slider',
        a: 1,
        b: 2,
        c: 3,
        caption: 'baz'
    }, obj.getPropertyDescriptor('baz'));
    a.end();
});

test('#getPropertyValue', function(a) {
    var obj = makeTestObject();
    a.equal(10, obj.getPropertyValue('foo'));
    a.equal(false, obj.getPropertyValue('bar'));
    a.equal(50, obj.getPropertyValue('baz'));
    a.end();
});

test('#setPropertyValue', function(a) {
    var obj = makeTestObject();
    obj.setPropertyValue('foo', 153);
    a.equal(153, obj.getPropertyValue('foo'));
    a.end();
});

test("duplicate property", function(a) {
    try {
        var obj = makeTestObject();
        obj.group().add('foo', 'text', 30);
        a.ok(false);
    } catch (e) {
        a.ok(true);
    }
    a.end();
});

test('#getPropertyValue - missing', function(a) {
    try {
        var obj = makeTestObject();
        obj.getPropertyValue('!!!');
        a.ok(false);
    } catch (e) {
        a.ok(true);
    }
    a.end();
});

test('#setPropertyValue - missing', function(a) {
    try {
        var obj = makeTestObject();
        obj.setPropertyValue('!!!', Infinity);
        a.ok(false);
    } catch (e) {
        a.ok(true);
    }
    a.end();
});

test('#onPropertyChange', function(a) {

    var obj = makeTestObject();
    obj.onPropertyChange(function(src, evt) {
        a.equal(src, obj);
        a.equal(evt.property, 'foo'),
        a.equal(evt.oldValue, 10);
        a.equal(evt.newValue, 50);
        a.equal(evt.values, obj._values); // cheeky
        a.end();
    });

    obj.set('foo', 50);

});