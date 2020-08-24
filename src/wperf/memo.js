/**
 * Memoization.
 *
 * Simple helper for memoizing functions.
 *
 * This uses JSON.stringify() for generating cache keys if:
 * - The function receives more than 1 argument.
 * - If the function receives only 1 argument, but this isn't a primitive
 *   value.
 *
 * It's important to note that JSON.stringify() is expensive. This will have a
 * significant impact on performance, and may render the memoization itself
 * useless. You will see the best performance gains if:
 * - You memoize functions that receive only 1 primitive argument (string,
 *   number, boolean).
 * - Your function is doing something very, very expensive and/or slow.
 *
 * @module jsutils/wperf/memo
 */

/**
 * Applies memoization to the passed function.
 *
 * Returns a new function, which behaves exactly as the passed one. All
 * arguments will be checked against previous calls, and if an exact same list
 * of arguments was already passed before, the result of that call will
 * immediately be returned.
 *
 * @param {Function} fn
 * @returns {Function}
 */
function memo(fn) {
  const cache = {};
  return function (...args) {
    let key;
    // Get the cache key.
    // Function only accepts 1 argument. We can make this faster by using the
    // first argument as the cache key, if a primitive type.
    if (args.length === 1) {
      switch (typeof args[0]) {
        case "string":
        case "bigint":
        case "number":
        case "boolean":
          key = args[0];
          break;
        default:
          key = JSON.stringify(args[0]);
          break;
      }
    } else {
      // Serialize the whole arguments array.
      key = JSON.stringify(args);
    }

    return cache[key] !== undefined
      ? cache[key]
      : (cache[key] = fn.apply(null, args));
  };
}

module.exports = memo;
