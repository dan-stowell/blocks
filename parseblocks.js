importScripts('md5.min.js');

let islineregex = new RegExp(/^\s*(\S+)\s+((?:\S+\s+)*)is\s+(\S.*)$/);
let blockislineregex = new RegExp(/^\s*(\S+)\s+((?:\S+\s+)*)is$/);
let whitespaceregex = new RegExp('\\s+');

function parseblocks(inputtext) {
  let version = md5(inputtext);

  let blocks = inputtext
    .split(new RegExp('\\n{2,}'));

  let blockdefs = [];
  let linedefs = [];
  let words = [];

  let parsedlines = [];

  blocks.forEach((block, whichblock) => {
    let lines = block.split('\n');

    lines.forEach((untrimmedline, whichline) => {
      let line = untrimmedline.trim();
      if (islineregex.test(line)) {
        let match = islineregex.exec(line);
        let name = match[1];
        let args = match[2]
          .trim()
          .split(new RegExp('\\s+'))
          .filter(word => word !== '');
        linedefs.push({
          'name': name,
          'args': args,
          'whichblock': whichblock,
          'whichline': whichline
        });

        let restofline = match[3];
        restofline
          .split(whitespaceregex)
          .forEach((word, whichword) => {
            words.push({
              'word': word,
              'whichblock': whichblock,
              'whichline': whichline,
              'whichword': whichword
            });
          });

      } else if (blockislineregex.test(line)) {
        let match = blockislineregex.exec(line);
        let name = match[1];
        let args = match[2]
          .trim()
          .split(new RegExp('\\s+'))
          .filter(word => word !== '');
        blockdefs.push({
          'name': name,
          'args': args,
          'whichblock': whichblock,
          'whichline': whichline
        });

      } else {
        line
          .split(whitespaceregex)
          .forEach((word, whichword) => {
            words.push({
              'word': word,
              'whichblock': whichblock,
              'whichline': whichline,
              'whichword': whichword
            });
          });

      }
    });

  });

  return {
    'version': version,
    'blockdefs': blockdefs,
    'linedefs': linedefs,
    'words': words
  };
}

onmessage = function(e) {
  let parsed = parseblocks(e.data);
  postMessage(parsed);
}