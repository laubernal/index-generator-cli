#!/usr/bin/env node

import * as fs from 'fs';
import { cwd } from 'process';
import path from 'path';
import { Command } from 'commander';

import { DirectoryNode } from './DirectoryNode';
import { DATA, DEFAULT_EXTENSION, INDEX_FILE } from './constants';

const commandPath = cwd();

let fileExtension: string;

if (typeof process.argv.slice(2)[0] === 'undefined') {
  fileExtension = DEFAULT_EXTENSION;
} else {
  fileExtension = process.argv.slice(2)[0];
}

function buildDirectoryTree(sourcePath: string) {
  // Get the first element of the Directory Tree
  const source = new DirectoryNode(sourcePath);

  // Create a stack to store each source element
  const stack = [source];

  while (stack.length) {
    // Get the first element of the stack
    const currentElement = stack.shift();

    if (currentElement) {
      // Get all elements from the current element
      const descendants = fs.readdirSync(currentElement.path);

      writeIndexFile(descendants, currentElement.path);

      for (let descendant of descendants) {
        // Get the path of each element
        const descendantPath = `${currentElement.path}\\${descendant}`;
        // Create a node for each element
        const descendantNode = new DirectoryNode(descendantPath);
        // Store the elements inside the node
        currentElement.children.push(descendantNode);

        if (fs.statSync(descendantNode.path).isDirectory()) {
          // Store the directory at the stack
          stack.push(descendantNode);
        }
      }
    }
  }

  return source;
}

function writeIndexFile(descendants: string[], filePath: string): void {
  const filesToExport = descendants
    .filter(filename => {
      return (
        path.extname(filename) === fileExtension && filename != INDEX_FILE.concat(fileExtension)
      );
    })
    .map(filename => `${DATA}${filename.replace(`${fileExtension}`, '')}';`)
    .join('\n');

  fs.writeFileSync(`${filePath}\\index.ts`, filesToExport);
}

const program = new Command();

program.option(
  '-g, --generate [extension]',
  `Index-generator is a command to create autommatically the index file to export
  all files of your project. You can specify which files you want to take into account by indicating the file 
  extension as a second argument of the command, example: index-generator .ts`,
  DEFAULT_EXTENSION
);

program.parse(process.argv);

const options = program.opts();

if (options.generate) {
  const directoryNode = buildDirectoryTree(commandPath);
  // console.log(JSON.stringify(directoryNode, null, 2));
  console.log('Index files created successfully');
}
