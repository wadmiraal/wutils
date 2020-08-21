/**
 * Compare argument arrays.
 *
 * For internal use only. Any non-scalar values are compared using Object.is().
 *
 * @param {Array} args1
 * @param {Array} args2
 * @returns {Boolean}
 */
function compareArgs(args1, args2) {
  if (args1.length !== args2.length) {
    return false;
  } else {
    for (let i = 0, len = args1.length; i < len; i++) {
      switch (typeof args1[i]) {
        case "string":
        case "number":
        case "boolean":
          if (args1[i] !== args2[i]) {
            return false;
          }
          break;
        default:
          if (!Object.is(args1[i], args2[i])) {
            return false;
          }
          break;
      }
    }
    return true;
  }
}

/**
 * Applies memoization to the passed function.
 *
 * Returns a new function, which behaves exactly as the passed one. All
 * arguments will be checked against previous calls, and if an exact same list
 * of arguments was already passed before, the result of that call will
 * immediately be returned. Uses Object.is() for non-scalar arguments.
 *
 * @param {Function} fn
 * @returns {Function}
 */
function memo(fn) {
  const cache = [];
  return function (...args) {
    const found = cache.find((c) => compareArgs(c.args, args));
    if (!found) {
      const result = fn.apply(null, args);
      cache.push({ args, result });
      return result;
    } else {
      return found.result;
    }
  };
}

module.exports = memo;
