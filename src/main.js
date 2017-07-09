import {Sigma, Factorial} from './modules'

console.log("Main.js executed!");
document.getElementById("sumof").innerHTML = Sigma(0, 100, x => x);
document.getElementById("fact").innerHTML = Factorial(10);
