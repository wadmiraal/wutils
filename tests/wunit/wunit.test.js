const {
  assertEqual,
  assertNotEqual,
  define,
  test,
} = require("../../src/wunit/wunit");

define("wunit functions", () => [
  test("assertions return correct information", () => [
    assertEqual(assertEqual(true, false), {
      ok: false,
      message: "true is not equal to false",
    }),
    assertEqual(assertEqual(true, true), {
      ok: true,
      message: "true is equal to true",
    }),
    assertEqual(assertNotEqual(true, true), {
      ok: false,
      message: "true is equal to true, but it shouldn't be",
    }),
    assertEqual(assertNotEqual(true, false), {
      ok: true,
      message: "true is not equal to false",
    }),
  ]),

  test("test returns correct information", () => {
    return [
      assertEqual(
        test("dummy", () => {}),
        {
          name: "dummy",
          total: 0,
          failures: ["Test did not contain any assertions."],
        }
      ),
      assertEqual(
        test("dummy", () => [{ ok: true, message: "Foo bar" }]),
        {
          name: "dummy",
          total: 1,
          failures: [],
        }
      ),
      assertEqual(
        test("dummy", () => [{ ok: false, message: "Foo bar" }]),
        {
          name: "dummy",
          total: 1,
          failures: ["Foo bar"],
        }
      ),
    ];
  }),
]);

define("wunit assertions", () => [
  test("simple assertions work correctly", () => [
    assertEqual(true, true),
    assertEqual("foo", "foo"),
    assertNotEqual(false, true),
    assertNotEqual("foo", "bar"),
    assertEqual(1, 1),
    assertNotEqual(1, 2),
  ]),

  test("assertions with functions work correctly", () => [
    assertEqual(define, define),
    assertNotEqual(define, test),
  ]),

  test("assertions with arrays work correctly", () => [
    assertEqual(["foo", 1], ["foo", 1]),
    assertEqual([1, "foo"], ["foo", 1]), // We don't care about the order.
    assertNotEqual(["foo", "bar"], ["foo", 1]),
  ]),

  test("assertions with objects work correctly", () => [
    assertEqual({ foo: "bar" }, { foo: "bar" }),
    assertNotEqual({ foo: "baz" }, { foo: "bar" }),
  ]),

  test("assertions with nested structures work correctly", () => [
    assertEqual({ foo: ["bar", { baz: 1 }] }, { foo: ["bar", { baz: 1 }] }),
    assertNotEqual(
      { foo: ["bar", { baz: 1 }] },
      {
        foo: ["bar", { baz: 2 }],
      }
    ),
  ]),
]);
