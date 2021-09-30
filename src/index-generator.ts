#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

import { DEFAULT_EXTENSION } from './constants';
import { DirectoryTree } from './DirectoryTree';

const program: Command = new Command();

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
  console.log(chalk.green('✔ Index files created successfully'));
}
