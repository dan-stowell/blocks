importScripts('md5.min.js');

let islineregex = new RegExp(/^\s*(\S+)\s+((\S+\s+)*)is\s+(.*)$/);
let blockislineregex = new RegExp(/^\s*(\S+)\s+((\S+\s+)*)is$/);

function parseblocks(inputtext) {
  let version = md5(inputtext);

  let blocks = inputtext
    .split(new RegExp('\\n{2,}'));

  let parsedlines = [];

  blocks.forEach((block, whichblock) => {
    let lines = block.split('\n');

    lines.forEach((line, whichline) => {
      if (islineregex.test(line)) {
        let match = islineregex.exec(line);
        let name = match[1];
        let args = match[2]
          .trim()
          .split(new RegExp('\\s+'))
          .filter(word => word !== '');
        let restofline = match[3];
        parsedlines.push({
          'name': name,
          'args': args,
          'lines': [restofline],
          'whichblock': whichblock,
          'whichline': whichline
        });

      } else if (blockislineregex.test(line)) {
        let match = blockislineregex.exec(line);
        let name = match[1];
        let args = match[2]
          .trim()
          .split(new RegExp('\\s+'))
          .filter(word => word !== '');
        let restoflines = lines.slice(whichline + 1);
        parsedlines.push({
          'name': name,
          'args': args,
          'lines': restoflines,
          'whichblock': whichblock,
          'whichline': whichline
        });

      } else {
        parsedlines.push({
          'name': '',
          'args': [],
          'lines': [line],
          'whichblock': whichblock,
          'whichline': whichline
        });

      }
    });

  });
  postMessage({'version': version, 'parsedlines': parsedlines});
}

onmessage = function(e) {
  let parsed = parseblocks(e.data);
  postMessage(parsed);
}