#!/usr/bin/env node

import { Command } from 'commander';

import { DEFAULT_EXTENSION } from './constants';
import { DirectoryTree } from './DirectoryTree';

const program = new Command();

program
  .option(
    '-g, --generate [extension]',
    'creates the index file to export all .ts files of your project',
    DEFAULT_EXTENSION
  )
  .parse(process.argv);

const options = program.opts();

if (options.generate) {
  const directoryNode = new DirectoryTree();
  directoryNode.buildDirectoryTree(directoryNode.getCommandPath());
  // console.log(JSON.stringify(directoryNode, null, 2));
  console.log('Index files created successfully');
}
