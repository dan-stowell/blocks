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
      let numblocks = input
        .value
        .split(new RegExp('\\n{2,}'))
        .filter(block => block !== "")
        .length;
      output.textContent = `${numblocks} blocks`;
    }, 1000);
});