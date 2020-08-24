/**
 * Simple hijacking utility.
 *
 * Simple utility to hijack object methods. By not bothering with error checking
 * (e.g.: does the object exist? Does the method exist? Is the method a real
 * method, or a getter/setter property?), nor with stacking or pattern matching,
 * we can keep this simple and small.
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
  const fakeMethod = (...args) => {
    return implem.apply(obj, args);
  };

  const {
    configurable,
    enumerable,
    writable,
    value,
  } = Object.getOwnPropertyDescriptor(obj, method);

  Object.defineProperty(obj, method, {
    configurable,
    enumerable,
    writable: false,
    value: fakeMethod,
  });

  return {
    restore() {
      Object.defineProperty(obj, method, {
        configurable,
        enumerable,
        writable,
        value,
      });
    },
  };
}

module.exports = hijack;
