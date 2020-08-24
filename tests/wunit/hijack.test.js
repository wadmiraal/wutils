const {
  assertEqual,
  define,
  test,
  assertNotEqual,
} = require("../../src/wunit/wunit");
const hijack = require("../../src/wunit/hijack");
const spyOn = require("../../src/wunit/spy");

define("wunit hijacking utility", () => [
  test("it correctly hijacks an object method implementation", () => {
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
  }),

  test("it can restore the original method", () => {
    const method = () => {};
    const hijackMe = { method };
    const hijacker = hijack(hijackMe, "method", () => {});

    const assertions = [assertNotEqual(method, hijackMe.method)];

    hijacker.restore();

    return [...assertions, assertEqual(method, hijackMe.method)];
  }),

  test("it can be combined with spying", () => {
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
  }),
]);
