/**
 * Simple unit testing library.
 *
 * Simple library for writing unit tests. Doesn't require any runner, as long
 * as define() is used. Simply execute the test file using Node, and define()
 * will do the rest.
 *
 * Design principles are simple:
 * - Keep it short and easy to use.
 * - Keep it as pure as possible: only define() is "impure". The assertions and
 *   test() are pure, and simply return information based on their parameters.
 * - No external libraries necessary.
 * - No specific runner required.
 *
 * Wunit is tested using Wunit, of course.
 *
 * @module jsutils/wunit/wunit
 */

const { echo, success, error, nl } = require("../wcli/output");

const INDENT = "  ";

/**
 * Helper function for printing out results.
 *
 * This will stringify the passed object, so it's more readable.
 *
 * This is internal to the module, and not exported.
 *
 * @param {*} o
 * @returns {string}
 */
function stringify(o) {
  if (typeof o === "function") {
    return "[Function]";
  } else {
    return JSON.stringify(o);
  }
}

/**
 * Actual function doing the equality check.
 *
 * This will perform deep recursive checks on objects and functions. So an
 * object that references itself could start an infinite loop. Deal with it.
 *
 * This is internal to the module, and not exported.
 *
 * @param {*} value
 * @param {*} expected
 * @returns {boolean}
 */
function areEqual(value, expected) {
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return value === expected;

    case "function":
      return Object.is(value, expected);

    case "object":
      if (Array.isArray(value) && Array.isArray(expected)) {
        // Both are arrays.
        if (value.length !== expected.length) {
          return false;
        } else {
          for (const item of value) {
            if (!expected.some((e) => areEqual(item, e))) {
              return false;
            }
          }
          return true;
        }
      } else if (!Array.isArray(value) && !Array.isArray(expected)) {
        // Neither are arrays, so both are objects.
        if (
          Object.getOwnPropertyNames(value).length !==
          Object.getOwnPropertyNames(expected).length
        ) {
          return false;
        } else {
          for (const property of Object.getOwnPropertyNames(value)) {
            if (!areEqual(value[property], expected[property])) {
              return false;
            }
          }
          return true;
        }
      } else {
        // Not the same type, so they cannot be the same.
        return false;
      }
  }

  // Unsupported comparison.
  return false;
}

/**
 * Equality assertion.
 *
 * This supports arrays and objects, and will perform deep, recursive equality
 * checks. Functions are compared using Object.is().
 *
 * @param {*} value
 * @param {*} expected
 * @returns {Object} Returns an object with the following keys:
 *   - {boolean} "ok": whether the assertion was correct.
 *   - {string} "message": the result in human-readable form.
 */
function assertEqual(value, expected) {
  const ok = areEqual(value, expected);
  return {
    ok,
    message: ok
      ? `${stringify(value)} is equal to ${stringify(expected)}`
      : `${stringify(value)} is not equal to ${stringify(expected)}`,
  };
}

/**
 * Non-equality assertion.
 *
 * This supports arrays and objects, and will perform deep, recursive equality
 * checks. Functions are compared using Object.is().
 *
 * @param {*} value
 * @param {*} expected
 * @returns {Object} Returns an object with the following keys:
 *   - {boolean} "ok": whether the assertion was correct.
 *   - {string} "message": the result in human-readable form.
 */
function assertNotEqual(value, expected) {
  const ok = !areEqual(value, expected);
  return {
    ok,
    message: ok
      ? `${stringify(value)} is not equal to ${stringify(expected)}`
      : `${stringify(value)} is equal to ${stringify(
          expected
        )}, but it shouldn't be`,
  };
}

/**
 * Groups related assertions together.
 *
 * The callback provided must provide at least 1 assertion, otherwise it will
 * be treated as a failing test.
 *
 * @param {string} name
 * @param {Function} cb
 * @returns {Object} Returns an object with the following keys:
 *   - {string} "name": the same as the name parameter
 *   - {Array} "failures": an array of error messages, if any
 *   - {number} "total": the total number of assertions run
 */
function test(name, cb) {
  const results = cb() || [];
  return {
    name,
    failures:
      results.length === 0
        ? ["Test did not contain any assertions."]
        : results.filter((r) => !r.ok).map((r) => r.message),
    total: results.length,
  };
}

/**
 * Starts a new test suite.
 *
 * @param {string} name
 * @param {Function} cb
 */
function define(name, cb) {
  const tests = cb() || [];
  const hasFailures = tests.some((t) => t.failures.length > 0);

  // Report.
  echo(`Start running suite: "${name}"`);
  tests.forEach((t) => {
    echo(INDENT, `Test: "${t.name}"`);
    if (t.failures.length) {
      error(
        INDENT,
        `✗ Test "${t.name}" failed with ${t.failures.length} error(s):`
      );
      t.failures.forEach((failure) => {
        error(INDENT, INDENT, `- ${failure}`);
      });
    }
    echo(
      INDENT,
      INDENT,
      `${Math.max(0, t.total - t.failures.length)} out of ${t.total} passed`
    );
  });

  if (hasFailures) {
    error(`✗ Suite "${name}" failed with failing tests.`);
    process.exitCode = 1;
  } else {
    success(`✓ Suite "${name}" passed!`);
  }
  nl();
}

module.exports = {
  assertEqual,
  assertNotEqual,
  define,
  test,
};
