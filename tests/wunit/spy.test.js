const {
  assertEqual,
  define,
  test,
  assertNotEqual,
} = require("../../src/wunit/wunit");
const spyOn = require("../../src/wunit/spy");

define("wunit spy utility", () => [
  test("it correctly spies on object methods", () => {
    const spyOnMe = {
      method() {
        return 1 + 1;
      },
    };
    const spy = spyOn(spyOnMe, "method");

    return [
      assertEqual(spyOnMe.method(), 2), // Can still call method normally.
      assertEqual(spy.wasCalled(), true),
      assertEqual(spy.lastCall(), { returnValue: 2, args: [] }),
    ];
  }),

  test("it can reset calls", () => {
    const spyOnMe = {
      method() {
        return 1 + 1;
      },
    };
    const spy = spyOn(spyOnMe, "method");

    spyOnMe.method();
    spyOnMe.method();
    const assertions = [assertEqual(spy.calls().length, 2)];

    spy.reset();
    spyOnMe.method();

    return [...assertions, assertEqual(spy.calls().length, 1)];
  }),

  test("it can restore the original method", () => {
    const method = () => 1 + 1;
    const spyOnMe = { method };
    const spy = spyOn(spyOnMe, "method");

    const assertions = [assertNotEqual(method, spyOnMe.method)];

    spy.restore();

    return [...assertions, assertEqual(method, spyOnMe.method)];
  }),
]);
