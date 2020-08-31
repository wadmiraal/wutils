const {
  assertEqual,
  define,
  test,
  assertNotEqual,
} = require("../../src/wunit/wunit");
const spyOn = require("../../src/wunit/spy");

define("wunit spy utility", [
  test(
    "it correctly spies on object methods",
    (function () {
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
    })()
  ),

  test(
    "it correctly spies on object getters/setters",
    (function () {
      const spyOnMe = {
        _property: "initial value",
        get property() {
          return this._property;
        },
        set property(value) {
          this._property = value;
        },
      };

      const spy = spyOn(spyOnMe, "property");

      const assertions = [
        assertEqual(spyOnMe.property, "initial value"), // Can still call method normally.
        assertEqual(spy.wasCalled(), true),
        assertEqual(spy.lastCall(), { returnValue: "initial value", args: [] }),
      ];

      spyOnMe.property = "override value"; // Can still call method normally.

      return [
        ...assertions,
        assertEqual(spy.wasCalled(), true),
        assertEqual(spy.lastCall(), {
          returnValue: undefined,
          args: ["override value"],
        }),
        assertEqual(spyOnMe.property, "override value"), // Can still call method normally.
        assertEqual(spy.calls().length, 3),
      ];
    })()
  ),

  test(
    "it can reset calls",
    (function () {
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
    })()
  ),

  test(
    "it can restore the original method",
    (function () {
      const method = () => 1 + 1;
      const spyOnMe = { method };
      const spy = spyOn(spyOnMe, "method");

      const assertions = [assertNotEqual(method, spyOnMe.method)];

      spy.restore();

      return [...assertions, assertEqual(method, spyOnMe.method)];
    })()
  ),
]);
