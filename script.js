
let input = document.getElementById('text');
let output = document.getElementById('output');

let parseblocksworker = new Worker('parseblocks.js');
parseblocksworker.onmessage = function(e) {
  let parsed = e.data;
  let version = parsed['version'];
  let parsedlines = parsed['parsedlines'];
  let summary = `${parsedlines.length} parsed lines, version ${version}`;
  output.textContent = summary;
};

function postparseblocks() {
  console.log('postparseblocks');
  parseblocksworker.postMessage(input.value);
}

let timeout = null;
input.addEventListener('keyup', function (e) {
  clearTimeout(timeout);
  timeout = setTimeout(postparseblocks, 70);
});