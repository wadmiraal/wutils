const { echo, success, error, nl } = require("../console/console");

const INDENT = "  ";

/**
 * Helper function for printing out results.
 *
 * This will stringify the passed object, so it's more readable on the console.
 * For internal use only.
 *
 * @param {*} o
 * @returns {String}
 */
function stringify(o) {
  switch (typeof o) {
    case "string":
    case "number":
    case "boolean":
    case "function":
      return o.toString();
    default:
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
 * @throws Error
 *   Will throw an error if the 2 values don't match.
 * @param {*} value
 * @param {*} expected
 */
function assertEqual(value, expected) {
  if (!areEqual(value, expected)) {
    throw new Error(
      `"${stringify(value)}" is not equal to "${stringify(expected)}"`
    );
  }
}

/**
 * Non-equality assertion.
 *
 * This supports arrays and objects, and will perform deep, recursive equality
 * checks. Functions are compared using Object.is().
 *
 * @throws Error
 *   Will throw an error if the 2 values match.
 * @param {*} value
 * @param {*} expected
 */
function assertNotEqual(value, expected) {
  if (areEqual(value, expected)) {
    throw new Error(
      `"${stringify(value)}" is equal to "${stringify(
        expected
      )}", but it shouldn't be`
    );
  }
}

/**
 * Starts a new test suite.
 *
 * @param {String} name
 * @param {Function} cb
 */
function define(name, cb) {
  echo(`Start running suite: "${name}"`);

  try {
    cb();
  } catch (e) {
    error(`✗ Suite "${name}" failed with failing tests.`);
    nl();
    process.exitCode = 1;
    return;
  }

  success(`✓ Suite "${name}" passed!`);
  nl();
}

/**
 * Groups related tests together.
 *
 * @param {String} name
 * @param {Function} cb
 */
function test(name, cb) {
  echo(INDENT, `Test: "${name}"`);

  const failures = [];
  try {
    cb();
  } catch (e) {
    failures.push(e.message);
  }

  if (failures.length) {
    error(INDENT, `✗ Test "${name}" failed with ${failures.length} errors:`);
    failures.forEach((failure) => {
      error(INDENT, INDENT, `- ${failure}`);
    });

    throw new Error(`Test "${name}" failed with ${failures.length} errors`);
  }
}

module.exports = {
  assertEqual,
  assertNotEqual,
  define,
  test,
};
