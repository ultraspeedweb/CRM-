"use strict";
const { globSync } = require("tinyglobby");
const { isAbsolute } = require("node:path");

// @next/eslint-plugin-next 16.4.1 uses only this synchronous directory lookup.
// Do not silently accept a broader fast-glob contract after an upstream upgrade.
exports.globSync = (pattern, options) => {
  if (typeof pattern !== "string" || options?.onlyDirectories !== true ||
      Object.keys(options).some(key => key !== "onlyDirectories")) {
    throw new TypeError("Review the Next lint glob adapter for this new API use");
  }
  return globSync(pattern, {
    onlyDirectories: true,
    expandDirectories: false,
    absolute: isAbsolute(pattern),
  }).map(path => path.replace(/\/$/, ""));
};
