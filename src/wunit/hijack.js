/**
 * Simple hijacking utility.
 *
 * Simple utility to hijack object methods. By not bothering with error checking
 * (e.g.: Does the object exist? Does the method exist?), as well as only
 * dealing with methods or getters (setters are not supported), nor with
 * stacking or pattern matching, we can keep this simple and small.
 *
 * The function returns a hijack object, which can be used to restore the
 * original method implementation.
 *
 * No return value stacking or pattern matching is supported; it's up to the
 * caller to implement those.
 *
 * @module jsutils/wunit/hijack
 */

function hijack(obj, method, implem) {
  const {
    configurable,
    enumerable,
    get,
    writable,
    value,
  } = Object.getOwnPropertyDescriptor(obj, method);

  const isGetter = get !== undefined;

  if (isGetter) {
    Object.defineProperty(obj, method, {
      configurable,
      enumerable,
      get: () => {
        return implem.apply(obj);
      },
    });
  } else {
    Object.defineProperty(obj, method, {
      configurable,
      enumerable,
      writable: false,
      value: (...args) => {
        return implem.apply(obj, args);
      },
    });
  }

  return {
    restore() {
      if (isGetter) {
        Object.defineProperty(obj, method, {
          configurable,
          enumerable,
          get,
        });
      } else {
        Object.defineProperty(obj, method, {
          configurable,
          enumerable,
          writable,
          value,
        });
      }
    },
  };
}

module.exports = hijack;
