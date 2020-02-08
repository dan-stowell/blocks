let islineregex = new RegExp(/^\s*(\S+)\s+is\s+(\S.*)$/);
let blockislineregex = new RegExp(/^\s*(\S+)\s+((\S+\s+)*)is$/);

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
      let numblockislines = 0;
      for (let block of blocks) {
        let lines = block.split('\n');
        numislines += lines
          .filter(line => islineregex.test(line))
          .length;

        numblockislines += lines
          .filter(line => blockislineregex.test(line))
          .length;
      }
      output.textContent = `${numblocks} blocks, ${numislines} islines, ${numblockislines} blockislines`;
    }, 500);
});