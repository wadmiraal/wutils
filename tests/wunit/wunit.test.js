const {
  assertEqual,
  assertNotEqual,
  define,
  test,
} = require("../../src/wunit/wunit");

define("wunit testing library", () => {
  test("simple assertions work correctly", () => {
    assertEqual(true, true);
    assertEqual("foo", "foo");
    assertNotEqual(false, true);
    assertNotEqual("foo", "bar");
    assertEqual(1, 1);
    assertNotEqual(1, 2);
  });

  test("assertions with functions work correctly", () => {
    assertEqual(define, define);
    assertNotEqual(define, test);
  });

  test("assertions with arrays work correctly", () => {
    assertEqual(["foo", 1], ["foo", 1]);
    assertEqual([1, "foo"], ["foo", 1]); // We don't care about the order.
    assertNotEqual(["foo", "bar"], ["foo", 1]);
  });

  test("assertions with objects work correctly", () => {
    assertEqual({ foo: "bar" }, { foo: "bar" });
    assertNotEqual({ foo: "baz" }, { foo: "bar" });
  });

  test("assertions with nested structures work correctly", () => {
    assertEqual({ foo: ["bar", { baz: 1 }] }, { foo: ["bar", { baz: 1 }] });
    assertNotEqual(
      { foo: ["bar", { baz: 1 }] },
      {
        foo: ["bar", { baz: 2 }],
      }
    );
  });
});
