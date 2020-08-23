const { assertEqual, define, test } = require("../../src/wunit/wunit");
const memo = require("../../src/wperf/memo");

define("memoization utility", () => [
  test("correctly calls the underlying function", () => {
    const fn = memo((a, b) => {
      return a + b;
    });
    return [assertEqual(fn(4, 5), 9)];
  }),

  test("correctly uses the cache, even if the function isn't pure", () => {
    let n = 0;
    const fn = (a) => {
      n++;
      return a + n;
    };
    const memoFn = memo(fn);

    return [
      assertEqual(memoFn(1), 2),
      assertEqual(memoFn(1), 2),
      assertEqual(fn(1), 3),
      assertEqual(fn(1), 4),
    ];
  }),

  test("can also use object parameters", () => {
    let n = 0;
    const memoFn = memo(({ count }) => {
      n++;
      return n + count;
    });
    const a = { count: 1 };

    return [
      assertEqual(memoFn(a), 2),
      assertEqual(memoFn(a), 2),
      assertEqual(memoFn({ count: 1 }), 2),
      assertEqual(memoFn({ count: 2 }), 4),
    ];
  }),
]);
