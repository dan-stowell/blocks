onmessage = function(e) {
  let message = `worker received version ${e.data}`;
  postMessage(message);
}