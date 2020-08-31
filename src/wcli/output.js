/**
 * Console helpers.
 *
 * Simple helpers for printing text to the console. Mainly serve to color the
 * passed text.
 *
 * @module jsutils/wcli/output
 */

module.exports = {
  /**
   * Prints the passed list of instructions to the console.
   *
   * @param {Array} instructions
   */
  print(instructions) {
    console.log(
      instructions.reduce((acc, { modifier = "", text }) => {
        return acc + `${modifier}${text} \x1b[0m`;
      }, "")
    );
  },
  echo(...text) {
    return {
      modifier: "\x1b[0m",
      text: text.join(" "),
    };
  },
  error(...text) {
    return {
      modifier: "\x1b[31m",
      text: text.join(" "),
    };
  },
  info(...text) {
    return {
      modifier: "\x1b[34m",
      text: text.join(" "),
    };
  },
  nl() {
    return {
      text: "\n",
    };
  },
  success(...text) {
    return {
      modifier: "\x1b[32m",
      text: text.join(" "),
    };
  },
  warn(...text) {
    return {
      modifier: "\x1b[33m",
      text: text.join(" "),
    };
  },
};
