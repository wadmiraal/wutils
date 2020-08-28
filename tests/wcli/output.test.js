const { assertEqual, define, test } = require("../../src/wunit/wunit");
const spyOn = require("../../src/wunit/spy");
const hijack = require("../../src/wunit/hijack");
const {
  echo,
  error,
  info,
  nl,
  success,
  warn,
} = require("../../src/wcli/output");

define("wcli output helpers", (function () {
  const hijacker = hijack(console, "log", () => {});
  const spy = spyOn(console, "log");

  const tests = [
    test(
      "echo works correctly",
      (function () {
        echo("TEST");
        return [assertEqual(spy.lastCall().args, ["TEST\x1b[0m"])];
      })()
    ),

    test(
      "error works correctly",
      (function () {
        error("TEST");
        return [assertEqual(spy.lastCall().args, ["\x1b[31mTEST\x1b[0m"])];
      })()
    ),

    test(
      "info works correctly",
      (function () {
        info("TEST");
        return [assertEqual(spy.lastCall().args, ["\x1b[34mTEST\x1b[0m"])];
      })()
    ),

    test(
      "nl works correctly",
      (function () {
        nl();
        return [assertEqual(spy.lastCall().args, [])];
      })()
    ),

    test(
      "success works correctly",
      (function () {
        success("TEST");
        return [assertEqual(spy.lastCall().args, ["\x1b[32mTEST\x1b[0m"])];
      })()
    ),

    test(
      "warn works correctly",
      (function () {
        warn("TEST");
        return [assertEqual(spy.lastCall().args, ["\x1b[33mTEST\x1b[0m"])];
      })()
    ),
  ];

  spy.restore();
  hijacker.restore();

  return tests;
})());
