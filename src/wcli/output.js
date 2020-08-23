/**
 * Console helpers.
 *
 * Simple helpers for printing text to the console. Mainly serve to color the
 * passed text.
 *
 * @module jsutils/wcli/output
 */

/**
 * Prints the passed text and modifier to the console.
 *
 * For internal use only. Makes sure the modifiers are reset at the end of the
 * printed text.
 *
 * @param {string} modifier
 * @param {...string} text
 */
function print(modifier, ...text) {
  console.log(`${modifier}${text.join(" ")}\x1b[0m`);
}

module.exports = {
  echo(...text) {
    print(...text);
  },
  error(...text) {
    print("\x1b[31m", ...text);
  },
  info(...text) {
    print("\x1b[34m", ...text);
  },
  nl() {
    console.log();
  },
  success(...text) {
    print("\x1b[32m", ...text);
  },
  warn(...text) {
    print("\x1b[33m", ...text);
  },
};
