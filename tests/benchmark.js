const Benchmark = require("benchmark");
const memo = require("../src/perf/memo");

function fibonacci(num) {
  if (num <= 1) return 1;
  return fibonacci(num - 1) + fibonacci(num - 2);
}

let memoFibonacci = (num) => {
  if (num <= 1) return 1;
  return memoFibonacci(num - 1) + memoFibonacci(num - 2);
};
memoFibonacci = memo(memoFibonacci);

function gcd(p1, p2) {
  let a = p1.number;
  let b = p2.number;
  let t;
  if (a < b) {
    t = b;
    b = a;
    a = t;
  }
  while (b !== 0) {
    t = b;
    b = a % b;
    a = t;
  }
  return a;
}

const memoGcd = memo(gcd);

new Benchmark.Suite()
  .add("perf/memo::fibonacci, no optimization", function () {
    fibonacci(10);
  })
  .add("perf/memo::fibonacci, with optimization", function () {
    memoFibonacci(10);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });

new Benchmark.Suite()
  .add("perf/memo::greatest common divider, no optimization", function () {
    gcd({ number: 102303, foo: "bar" }, { number: 145026, baz: ["bar"] });
  })
  .add("perf/memo::greatest common divider, with optimization", function () {
    memoGcd({ number: 102303, foo: "bar" }, { number: 145026, baz: ["bar"] });
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
