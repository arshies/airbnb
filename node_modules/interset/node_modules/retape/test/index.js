"use strict";

exports["test fail fast"] = require("test/test/fail-fast")
exports["test async"] = require("test/test/async")

require("../retape")(exports)
