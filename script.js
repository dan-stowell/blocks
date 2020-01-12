class IsLine {
  constructor(name, words) {
    this.name = name;
    this.words = words;
  }

  eval(env) {
    let firstword = words[0];
    let firstvalue = env.lookup(firstword);
    let value = firstvalue;
    for (word of this.words.slice(1)) {
      if (value.knows(word)) {
        value = value.apply(word);
      } else if (env.has(word)) {
        // also should check if current value accepts arguments
        // because we'll be iterating over the remaining words,
        // looking them up in the environment, and passing those
        // values to the FunctionValue
      } else {
        // not sure what to do if we get here but flashing red
        // probably is not the right move
      }
    }
  }
}

let islineregex = new RegExp(/^\S+\s+is\s+\S.*$/);

// Get the input box
let input = document.getElementById('text');
let output = document.getElementById('output');

// Init a timeout variable to be used below
let timeout = null;

// Listen for keystroke events
input.addEventListener('keyup', function (e) {
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(function () {
      let blocks = input
        .value
        .split(new RegExp('\\n{2,}'));

      let numblocks = blocks
        .filter(block => block !== "")
        .length;

      let numislines = 0;
      for (block of blocks) {
        numislines += block
          .split('\n')
          .filter(line => islineregex.test(line))
          .length;
      }
      output.textContent = `${numblocks} blocks, ${numislines} islines`;
    }, 1000);
});