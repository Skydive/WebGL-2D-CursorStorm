(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _modules = require("./modules");

console.log("Main.js executed!");
document.getElementById("sumof").innerHTML = (0, _modules.Sigma)(0, 100, function (x) {
  return x;
});
document.getElementById("fact").innerHTML = (0, _modules.Factorial)(10);

},{"./modules":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function Sigma(l, u, f) {
	var Sum = 0;
	for (var i = l; i <= u; i++) {
		Sum += f(i);
	}
	return Sum;
}

function Factorial(n) {
	if (n == 1) return 1;
	return n * Factorial(n - 1);
}

exports.Sigma = Sigma;
exports.Factorial = Factorial;

},{}]},{},[1]);
