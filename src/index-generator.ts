#!/usr/bin/env node

import * as path from 'path';
import * as fs from 'fs';
import { cwd } from 'process';

console.log('hi there');

// Obtain current path
const currentPath = cwd();
console.log('Current path', currentPath);

const filenames = fs.readdirSync(currentPath);
console.log('filenames:', filenames);

const traverseDF = (fn: any) => {
  while (filenames.length) {
    const file = filenames.shift();

    const filePath = `${currentPath}/${file}`;

    const stats = fs.lstatSync(filePath);

    if (stats.isDirectory()) {
      filenames.unshift(...fs.readdirSync(filePath));
      continue;
    }

    fn(file);
  }
};

traverseDF(console.log);

// fs.readdir(currentPath, async (err, filenames) => {
//   if (err) {
//     console.log(err);
//   }

//   const statPromises = filenames.map(filename => {
//     return fs.lstat(path.join(currentPath, filename));
//   });

//   const allStats = await Promise.all(statPromises);

//   for (let stats of allStats) {
//     const index = allStats.indexOf(stats);

//     if (stats.isFile()) {}
//   }
// });

// Check if it's a dir or a file
// fs.lstat(currentPath, (err, stats) => {});

// Implement DFS algorithm
// Create a node class that through the constructor accepts an argument that gets assigned to the data property
// and initialize an empty array for storing children. Methods add and remove --- add [export * from 'path']

// Create a tree class that the constructor initializes a root property to null. Method 'traverseDF' should
// accept a function that gets called with each element in the tree

// Implement writeFile
