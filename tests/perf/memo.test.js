const { assert, define, it } = require("../../src/wunit/wunit");
const { memo } = require("../../src/perf/memo");

define("memoization utility", () => {
  it("correctly calls the underlying function", () => {
    const fn = memo((a, b) => {
      return a + b;
    });
    assert(fn(4, 5)).equals(9);
  });

  it("correctly uses the cache, even if the function isn't pure", () => {
    let n = 0;
    const fn = (a) => {
      n++;
      return a + n;
    };
    const memoFn = memo(fn);

    assert(memoFn(1)).equals(2);
    assert(memoFn(1)).equals(2);

    assert(fn(1)).equals(3);
    assert(fn(1)).equals(4);
  });

  it("can also use objects", () => {
    let n = 0;
    const memoFn = memo(({ count }) => {
      n++;
      return n + count;
    });
    const a = { count: 1 };

    assert(memoFn(a)).equals(2);
    assert(memoFn(a)).equals(2);
    assert(memoFn({ count: 1 })).equals(3); // Will fail the Object.is() check.
  });
});
