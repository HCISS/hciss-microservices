import Benford from "./benfordslaw.js";

function fibonacci(n) {
    for (var fibonacci = [0, 1], i = 1; i < n; i++) 
      fibonacci.push(fibonacci[i] + fibonacci[i - 1])
    return fibonacci
  }

let d = fibonacci(1000);

//console.log(prices, result);
const benford = new Benford(d );
const computed = benford.printAsTable();

