#!/usr/bin/env node

import * as fs from 'fs';
import { cwd } from 'process';
import path from 'path';

const INDEX_FILE: string = 'index';
const DEFAULT_EXTENSION: string = '.ts';
const DATA: string = "export * from './";

const commandPath = cwd();

let fileExtension: string;

if (typeof process.argv.slice(2)[0] === 'undefined') {
  fileExtension = DEFAULT_EXTENSION;
} else {
  fileExtension = process.argv.slice(2)[0];
}

class DirectoryNode {
  public children: Array<DirectoryNode> = [];

  constructor(public path: string) {}
}

function buildDirectory(sourcePath: string) {
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

const directoryNode = buildDirectory(commandPath);
console.log(JSON.stringify(directoryNode, null, 2));
