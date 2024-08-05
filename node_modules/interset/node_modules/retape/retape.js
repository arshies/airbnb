"use strict";

var tape = require("tape")
var owns = Object.prototype.hasOwnProperty
var keys = Object.keys || function(object) {
  var result = []
  for (var key in object) {
    if (owns.call(object, object[key])) {
      result.push(key)
    }
  }
}

function adaptAsync(unit) {
  return function(assert) {
    unit(assert, function() {
      assert.end()
    })
  }
}

function adaptSync(unit) {
  return function(assert) {
    unit(assert)
    assert.end()
  }
}

function adapt(suite, test) {
  test = test || tape
  Object.keys(suite).forEach(function(name) {
    // CommonJS cares only about names that start with test.
    if (name.indexOf("test") !== 0) return
    var unit = suite[name]

    // If unit is a function then adapt it.
    if (typeof(unit) === "function") {
      var adapted = unit.length > 1 ? adaptAsync(unit) :
                    adaptSync(unit)

      test(name, adapted)
    } else if (unit && typeof(unit) === "object"){
      test(name, function(test) {
        adapt(unit, function(name, unit) {
          test.test(name, unit)
          test.end()
        })
      })
    }
  })
}

module.exports = adapt
