'use strict';

// require each functions
const helloWorld = require('./functions/helloWorld');
const helloUniverse = require('./functions/helloUniverse');

// map each function to an export
// when we deploy this code using `npm run deploy` it will deploy each function individually:
exports.helloWorld = helloWorld.handler;
exports.helloUniverse = helloUniverse.handler;

// for local development in order to have a single port serve all our functions, we'll do the following:
exports.local =  function local(req, res) {
    switch (req.path) {
      case '/helloWorld':
        return helloWorld.handler(req, res)
      case '/helloUniverse':
        return helloUniverse.handler(req, res)
      default:
        res.send('function not defined')
    }
  }