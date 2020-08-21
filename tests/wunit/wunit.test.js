const { assert, define, test } = require("../../src/wunit/wunit");

define("wunit testing library", () => {
  test("simple assertions work correctly", () => {
    assert(true).equals(true);
    assert("foo").equals("foo");
    assert(false).doesNot.equal(true);
    assert("foo").doesNot.equal("bar");
    assert(1).equals(1);
    assert(1).doesNot.equal(2);
  });

  test("assertions with functions work correctly", () => {
    assert(assert).equals(assert);
    assert(assert).doesNot.equal(test);
  });

  test("assertions with arrays work correctly", () => {
    assert(["foo", 1]).equals(["foo", 1]);
    assert([1, "foo"]).equals(["foo", 1]); // We don't care about the order.
    assert(["foo", "bar"]).doesNot.equal(["foo", 1]);
  });

  test("assertions with objects work correctly", () => {
    assert({ foo: "bar" }).equals({ foo: "bar" });
    assert({ foo: "baz" }).doesNot.equal({ foo: "bar" });
  });

  test("assertions with nested structures work correctly", () => {
    assert({ foo: ["bar", { baz: 1 }] }).equals({ foo: ["bar", { baz: 1 }] });
    assert({ foo: ["bar", { baz: 1 }] }).doesNot.equal({
      foo: ["bar", { baz: 2 }],
    });
  });
});
