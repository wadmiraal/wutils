/**
 * Simple spying utility.
 *
 * Simple utility to spy on object methods. By not bothering with error checking
 * (e.g.: does the object exist? Does the method exist? Is the method a real
 * method, or a getter/setter property?), and keeping interactions with the spy
 * to a minimum, we can make this very small and simple.
 *
 * The function returns a spy object, which tracks calls made to the method, and
 * can be used to restore the original method implementation.
 *
 * No mocking or pattern matching is supported; it's up to the caller to
 * implement those.
 *
 * @module jsutils/wunit/spy
 */

function spyOn(obj, method) {
  let calls = [];

  const realMethod = obj[method];
  const fakeMethod = (...args) => {
    const returnValue = realMethod.apply(obj, args);
    calls.push({ returnValue, args });
    return returnValue;
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
    calls() {
      return calls;
    },
    lastCall() {
      return calls.length > 0 ? calls[calls.length - 1] : undefined;
    },
    wasCalled() {
      return calls.length > 0;
    },
    reset() {
      calls = [];
    },
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

module.exports = spyOn;
