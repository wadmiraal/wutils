const {
  assertEqual,
  define,
  test,
  assertNotEqual,
} = require("../../src/wunit/wunit");
const spyOn = require("../../src/wunit/spy");
const hijack = require("../../src/wunit/hijack");
const {
  echo,
  error,
  info,
  nl,
  print,
  success,
  warn,
} = require("../../src/wcli/output");

define("wcli output helpers", [
  test("instruction helpers works correctly", [
    assertEqual(echo("TEST"), { modifier: "\x1b[0m", text: "TEST" }),
    assertEqual(error("TEST"), { modifier: "\x1b[31m", text: "TEST" }),
    assertEqual(info("TEST"), { modifier: "\x1b[34m", text: "TEST" }),
    assertEqual(success("TEST", "TEST"), {
      modifier: "\x1b[32m",
      text: "TEST TEST",
    }),
    assertEqual(warn("TEST", "TEST"), {
      modifier: "\x1b[33m",
      text: "TEST TEST",
    }),
    assertEqual(nl(), { text: "\n" }),
  ]),

  test(
    "printing instructions works correctly",
    (function () {
      const hijacker = hijack(console, "log", () => {});
      const spy = spyOn(console, "log");

      print([echo("1"), nl(), echo("2"), echo("3")]);

      spy.restore();
      hijacker.restore();

      return [
        assertEqual(spy.lastCall().args, [
          "\x1b[0m1 \x1b[0m\n \x1b[0m\x1b[0m2 \x1b[0m\x1b[0m3 \x1b[0m",
        ]),
      ];
    })()
  ),
]);
