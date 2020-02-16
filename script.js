
let input = document.getElementById('text');
let output = document.getElementById('output');

let parseblocksworker = new Worker('parseblocks.js');
parseblocksworker.onmessage = function(e) {
  let data = e.data;
  let version = data['version'];
  let blockdefs = data['blockdefs'];
  let linedefs = data['linedefs'];
  let words = data['words'];
  let summary = `${words.length} words, ${blockdefs.length} blockdefs, ${linedefs.length} linedefs, version ${version}`;
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