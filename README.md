bucks.js
========

Async chain utility for node and the browser. (amd support)

# Build

dependence) `node.js`

`$ npm install .`

`$ make`

# Examples

## add and end

`add` is general way to add a task to bucks object.
`end` starts executing added tasks.
Results and errors can be passed to next task in various way.

task is generally `task(err, res, next)` form function.
next task waits until `next` is called in previous task.
if `next` is not specified, next task is called immediately with
returned value.

```javascript
//
// new Bucks object
//
var b = new Bucks();

//
// Add and add several tasks.
//
b.add(function f1(err, res) {

    return 'a';

}).add(function f2(err, res, next) {

    // res => 'a'
    return next(null, 3);

}).add(function f3(err, res, next) {

    // res => 3
    return next(new Error('error after 3'));

}).add(function f4(err, res, next) {

    // err => 'error after 3'
    return next(null, "recover 4");

}).add(function f5(err, res) {

    // res => 'recover 4'
    throw new Error('error in f5');

}).add(function f6(err, res) {

    // err => 'error in f5'
    throw err;

}).add(function f7(err, res) {

    // err => 'error in f5'
    // ignore and return
    return "recover 7";

}).add(function f8(err, res, next) {

    // res => 'recover 7';
    throw new Error('error in f8');

}).add(function f9(err, res, next) {

    // err => 'Error in f8'
    // ignore error
    return next(null, 'result of 9');

}).end(function last(err, results) {

    // all of results
    // are obtained in #end

    // err => null

    // results => [
    //     'a',
    //     null,
    //     null,
    //     'recover 4',
    //     null,
    //     null,
    //     'recover 7',
    //     null,
    //     'result of 9'
    // ];
});
```


## then

`then` adds a task called only in case of success

```javascript
b = new Bucks();
b.then(function start() {
    return 'start';
}).then(function second(res, next) {
    // res => 'start'
    return next(null, 'second')
}).end();
```

## delay

`delay` add delay execution

```javascript
b = new Bucks();
b.add(function (){ /** program */ })
.delay(1 * 1000) // 1ms
.add(function() { /** program */})
.end();
```

## error

`error` adds a task called only in case of error

```javascript
b.then(function start() {
    throw new Error('error in start');
    return 'start';
}).error(function onError(e, next) {
    // e => 'error in start'
    return next();
}).end();
```

## final errorback in end

Second param in `end` works as final errorback.

```javascript
//
// last error back
//
b = new Bucks();
b.empty(
    // add empty task (#end with no task cause error)
).end(function last(err, res) {
    // error in last callback
    throw new Error('error in end');
}, function finalErrorback(err) {
    // catch uncaught error in last callback
    // err => 'error in end'
});
```

## uncaught error

uncaught errors properly thrown to outside of chain.

```javascript
try {
    var b = new Bucks();
    b.then(function () {
        throw new Error('error');
    }).end();
} catch(e) {
    // e => 'error'
}

```

## waterfall

`waterfall` is another way to add several tasks.

```javascript
var t1 = function t1(err, res) {
    return 't1';
};
var t2 = function t2(err, res) {
    return 't2';
};

new Bucks.waterfall([t1, t2]).end(function finish(err, ress) {
    // ress => ['t1', 't2']
});

// same as
new Bucks.add(t1).add(t2).end(function finish(err, ress) {
    // ress => ['t1', 't2']
});
```


## parallel

`parallel` executes tasks in asynchronous way and join their results

```javascript

b = new Bucks();

b.parallel([
    function task1(err, res) {
        return "task1";
    },
    function task2(err, res, next) {
        return next(null, "task2");
    },
    function task3(err, res, next) {
        return next(new Error('passed error in task3'));
    },
    function task4(err, res, next) {
        throw new Error('thrown error in task4');
    }
]).add(function getResults(err, res, next) {
    // res => {
    //     err: [
    //         null,
    //         null,
    //         [Error: passed error in task3],
    //         [Error: thrown error in task4]
    //     ],
    //     res: [
    //         'task1',
    //         'task2',
    //         null,
    //         null
    //     ]
    // }
    next();
}).end();
```


## onError

`onError` Function to handle exceptions that have not been processed

```javascript
var onError = function (e, bucks) {
    console.log("Custom onError");
};

// Bucks.onError!!
Bucks.onError(onError);
var b0 = new Bucks();
b0
    .add(function(err, next) {
        throw new Error('b0');
    })
    .end()
;

```

## dispose

```javascript
var b0 = new Bucks();

b0.dispose = function dispose () {
    delete b0.dummy;
}

b0
    .add(function(err, next) {
        b0.dummy = "dummy";
        next();
    })
    .end(null, null)
;

```

## DEBUG

The output debug log

```
Bucks.DEBUG = true;
```


# AUTHORS

## Kei FUNAGAYAMA

* [https://github.com/fkei](https://github.com/fkei)
* [https://twitter.com/fkei](https://twitter.com/fkei)

## Kazuma MISHIMAGI

* [https://github.com/maginemu](https://github.com/maginemu)
* [https://twitter.com/maginemu](https://twitter.com/maginemu)

## CyberAgent Publicity

* [infosys_oss@cyberagent.co.jp](mailto:infosys_oss@cyberagent.co.jp)


# Changelog

@see https://github.com/CyberAgent/bucks.js/blob/master/Changelog


# Copyright

CyberAgent, Inc. All rights reserved.


# License

MIT @see https://github.com/CyberAgent/bucks.js/blob/master/LICENSE


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/CyberAgent/bucks.js/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

