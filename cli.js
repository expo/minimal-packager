#!/usr/bin/env node

const xdl = require('xdl');
const {
  Project,
  ProjectUtils,
} = xdl;

let projectRoot = process.cwd();

function formatMsg(msg) {
  return msg.replace(/(.{120})/g, "$1\n");
}

Project.startAsync(projectRoot, {reset: true}).then(manifest => {
  ProjectUtils.attachLoggerStream(projectRoot, {
    stream: {
      write: (chunk) => {
        console.log(`[${chunk.tag}] ${formatMsg(chunk.msg)}`);
      },
    },
    type: 'raw',
  });

  Project.getUrlAsync(projectRoot).then(url => {
    console.log(`Serving project at: ${url}`);
  });
});

process.on('SIGINT', () => {
  console.log('Stopping packager...');
  Project.stopAsync(projectRoot).then(() => {
    console.log('Packager stopped.');
    process.exit();
  });;
});
