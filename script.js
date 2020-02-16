
let input = document.getElementById('text');
let output = document.getElementById('output');

let parseblocksworker = new Worker('parseblocks.js');
parseblocksworker.onmessage = function(e) {
  let data = e.data;
  let version = data['version'];
  let parsedlines = data['parsedlines'];
  let summary = `${parsedlines.length} parsed lines, version ${version}`;
  output.textContent = summary;
};

function postparseblocks() {
  parseblocksworker.postMessage(input.value);
}

let timeout = null;
input.addEventListener('keyup', function (e) {
  clearTimeout(timeout);
  timeout = setTimeout(postparseblocks, 70);
});