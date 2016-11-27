#!/usr/bin/env node

const xdl = require('xdl');
const {
  Project,
  ProjectUtils,
} = xdl;

let projectRoot = process.cwd();

ProjectUtils.attachLoggerStream(projectRoot, {
  stream: {
    write: (chunk) => {
      console.log(`[${chunk.tag}] ${chunk.msg}`);
    },
  },
  type: 'raw',
});

Project.startAsync(projectRoot, {reset: true}).then(manifest => {
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
