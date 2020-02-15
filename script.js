let islineregex = new RegExp(/^\s*(\S+)\s+((\S+\s+)*)is\s+(.*)$/);
let blockislineregex = new RegExp(/^\s*(\S+)\s+((\S+\s+)*)is$/);

// Get the input box
let input = document.getElementById('text');
let output = document.getElementById('output');

// Init a timeout variable to be used below
let timeout = null;

let versions = [];
let version2blocks = {};
let version2blockparsedlines = {};

let parseblocksworker = new Worker('parseblocks.js');
parseblocksworker.onmessage = function(e) {
  console.log(`main received message: ${e.data}`);
};

function parseblocks() {
  let version = md5(input.value)
  parseblocksworker.postMessage(version);

  let blocks = input
    .value
    .split(new RegExp('\\n{2,}'));

  versions.push(version);
  version2blocks[version] = blocks;
  version2blockparsedlines[version] = [];

  let numblocks = blocks
    .filter(block => block !== "")
    .length;

  let numlines = 0;
  let numparsedlines = 0;
  let blockparsedlines = [];
  blocks.forEach((block, whichblock) => {
    let lines = block.split('\n');
    let parsedlines = [];

    lines.forEach((line, whichline) => {
      numlines += 1;
      if (islineregex.test(line)) {
        let match = islineregex.exec(line);
        let name = match[1];
        let args = match[2]
          .trim()
          .split(new RegExp('\\s+'))
          .filter(word => word !== '');
        let restofline = match[3];
        parsedlines.push({'name': name, 'args': args, 'lines': [restofline]});

      } else if (blockislineregex.test(line)) {
        let match = blockislineregex.exec(line);
        let name = match[1];
        let args = match[2]
          .trim()
          .split(new RegExp('\\s+'))
          .filter(word => word !== '');
        let restoflines = lines.slice(whichline + 1);
        parsedlines.push({'name': name, 'args': args, 'lines': restoflines});

      } else {
        parsedlines.push({'name': '', 'args': [], 'lines': [line]});

      }
    });

    numparsedlines += parsedlines.length;
    version2blockparsedlines[version].push(parsedlines);
  });
  output.textContent = `${numlines} lines, ${numparsedlines} parsed lines, ${versions.length} versions, version ${version}`;
}

// Listen for keystroke events
input.addEventListener('keyup', function (e) {
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);

    // Make a new timeout set to go off in 1000ms (1 second)
    timeout = setTimeout(parseblocks, 70);
});