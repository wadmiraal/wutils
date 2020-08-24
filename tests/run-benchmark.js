const Benchmark = require("benchmark");
const memo = require("../src/wperf/memo");

function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

let memoFibonacci = (num) => {
  if (num <= 1) return 1;
  return memoFibonacci(num - 1) + memoFibonacci(num - 2);
};
memoFibonacci = memo(memoFibonacci);

let memoFibonacciObject = ({ num }) => {
  if (num <= 1) return 1;
  return (
    memoFibonacciObject({ num: num - 1 }) +
    memoFibonacciObject({ num: num - 2 })
  );
};
memoFibonacciObject = memo(memoFibonacciObject);

new Benchmark.Suite()
  .add("perf/memo::fibonacci, no optimization", function () {
    fibonacci(10);
  })
  .add("perf/memo::fibonacci, object param, with optimization", function () {
    memoFibonacciObject({ num: 10 });
  })
  .add("perf/memo::fibonacci, with optimization", function () {
    memoFibonacci(10);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .run({ async: true });
