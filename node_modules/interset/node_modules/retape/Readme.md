# retape

[![browser support](http://ci.testling.com/Gozala/retape.png)](http://ci.testling.com/Gozala/retape)
[![Build Status](https://secure.travis-ci.org/Gozala/retape.png)](http://travis-ci.org/Gozala/retape)


[CommonJS test][] to [tape][] adapter, allowing you to use [testling ci][]
without rewriting any of your tests. In a future probably [test][] will just
produce [tap][] output to be compatible with [testling ci][] out of the box.

## Usage

Only thing you need to do is create adapter module that wraps your entry test
module:

```js
var retape = require("retape")
retape(require("test/index")) // Or whatever your entry point test module is.
```

Of course you'll also need to set up your `package.json` and github repo as
instructed by [testling ci][].

## Install

    npm install retape

[CommonJS test]:https://github.com/Gozala/test-commonjs/
[tap]:https://github.com/substack/tape
[testling ci]:http://ci.testling.com/
[tap]:http://testanything.org/wiki/
