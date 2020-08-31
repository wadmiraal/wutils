const {
  assertEqual,
  define,
  test,
  assertNotEqual,
} = require("../../src/wunit/wunit");
const hijack = require("../../src/wunit/hijack");
const spyOn = require("../../src/wunit/spy");

define("wunit hijacking utility", [
  test(
    "it correctly hijacks an object method implementation",
    (function () {
      const hijackMe = {
        adder: 1,
        method(a) {
          return a + this.adder;
        },
      };

      const assertions = [assertEqual(hijackMe.method(2), 3)];

      hijack(hijackMe, "method", function (a) {
        return a - this.adder; // Has access to object's "this".
      });

      return [...assertions, assertEqual(hijackMe.method(2), 1)];
    })()
  ),

  test(
    "it correctly hijacks an object getter implementation",
    (function () {
      const hijackMe = {
        _property: "initial value",
        get property() {
          return this._property;
        },
        set property(value) {
          this._property = value;
        },
      };

      const assertions = [assertEqual(hijackMe.property, "initial value")];

      hijack(hijackMe, "property", function () {
        return "OVERRIDE " + this._property; // Has access to object's "this".
      });

      return [
        ...assertions,
        assertEqual(hijackMe.property, "OVERRIDE initial value"),
      ];
    })()
  ),

  test(
    "it can restore the original method",
    (function () {
      const method = () => {};
      const hijackMe = { method };
      const hijacker = hijack(hijackMe, "method", () => {});

      const assertions = [assertNotEqual(method, hijackMe.method)];

      hijacker.restore();

      return [...assertions, assertEqual(method, hijackMe.method)];
    })()
  ),

  test(
    "it can be combined with spying",
    (function () {
      const hijackMe = {
        method() {
          return 1;
        },
      };

      hijack(hijackMe, "method", function () {
        return 2;
      });
      const spy = spyOn(hijackMe, "method");

      return [
        assertEqual(hijackMe.method(), 2),
        assertEqual(spy.wasCalled(), true),
      ];
    })()
  ),
]);
