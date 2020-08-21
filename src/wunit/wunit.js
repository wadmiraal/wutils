const { echo, success, error, info } = require("../console/console");

function stringify(o) {
  switch (typeof o) {
    case "string":
    case "number":
    case "boolean":
    case "function":
      return o.toString();
    case "object":
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
function doEquals(value, expected) {
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
            if (!expected.some((e) => doEquals(item, e))) {
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
            if (!doEquals(value[property], expected[property])) {
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
 * Assertion helper class.
 *
 * This utility class is only for internal use. It helps the chaining of
 * assertions, which make tests more readable.
 *
 * E.g.:
 *   assert(true).equals(true);
 */
class Assertion {
  #value;

  constructor(value) {
    this.#value = value;
  }

  get doesNot() {
    return new NegatedAssertion(this.#value);
  }

  equals(expected) {
    if (!doEquals(this.#value, expected)) {
      throw new Error(
        `"${stringify(this.#value)}" is not equal to "${stringify(expected)}"`
      );
    }
  }
}

/**
 * Similar to the Assertion class, but negates the check.
 *
 * This class doesn't have a "negation" getter, and can only be used from the
 * Assertion class's "doesNot" getter method.
 *
 * E.g.:
 *   assert(true).doesNot.equal(false);
 */
class NegatedAssertion {
  #value;

  constructor(value) {
    this.#value = value;
  }

  equal(expected) {
    if (doEquals(this.#value, expected)) {
      throw new Error(
        `"${stringify(this.#value)}" is equal to "${stringify(
          expected
        )}", but it shouldn't be`
      );
    }
  }
}

const INDENT = "  ";
/**
 * Runs the actual tests.
 *
 * For internal use. Supports "it" and "test" verbs, which slightly alter the
 * console output.
 *
 * @param {String} verb
 * @param {String} name
 * @param {Function} cb
 */
function doTest(verb, name, cb) {
  if (verb === "it") {
    echo(INDENT, `It ${name}`);
  } else {
    echo(INDENT, `Test: "${name}"`);
  }

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

/**
 * Starts an assertion of a value.
 *
 * This supports arrays and objects, and will perform deep, recursive equality
 * checks. Functions are compared using Object.is().
 *
 * E.g.:
 *   assert(true).equals(true);
 *   assert(true).doesNot.equal(false);
 *
 * @param {*} value
 * @returns {Assertion} An assertion object
 */
function assert(value) {
  return new Assertion(value);
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
    echo(""); // new line;
    process.exitCode = 1;
    return;
  }

  success(`✓ Suite "${name}" passed!`);
  echo(""); // new line;
}

/**
 * Groups related tests together.
 *
 * @param {String} name
 * @param {Function} cb
 */
function test(name, cb) {
  doTest("test", name, cb);
}

/**
 * Alias for test().
 *
 * @see test()
 */
function it(name, cb) {
  doTest("it", name, cb);
}

module.exports = {
  assert,
  define,
  it,
  test,
};
