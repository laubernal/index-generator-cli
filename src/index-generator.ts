#!/usr/bin/env node

import * as fs from 'fs';
import { cwd } from 'process';

// Obtain current path
const currentPath = cwd();
// console.log('Current path', currentPath);

const filenames = fs.readdirSync(currentPath);
console.log('filenames:', filenames);

const traverseDF = (fn: any) => {
  while (filenames.length) { 
    // Check if there is an index.ts file inside the directory
    // const indexFile = filenames.find((filename: string) => {
    //   return filename === 'index.ts';
    // });

    // Take the first one out
    const file = filenames.shift();
    console.log('File:', file);

    const filePath = `${currentPath}\\${file}`;
    // console.log('File Path: ', filePath);

    // Obtain the stats of the file
    const stats = fs.lstatSync(filePath);

    // Check if it is a directory
    if (stats.isDirectory()) {
      // Insert all files of the directoy at the beginning of the array
      filenames.unshift(...fs.readdirSync(filePath));
      continue;
    }

    console.log(filenames);

    // It is a file -> write "export * from 'file'" inside the index.ts file
    // Check if file is not undefined
    if (file) {
      const filenamesToExport = filenames.map(filename => {
        return filename.split('.ts');
      });
      console.log('Filenames to export:', filenamesToExport);

      const data = `\nexport * from './${filenamesToExport[0]}';`;
      console.log('Data:', data);

      fs.appendFileSync('index.ts', data, 'utf-8');
    }
    // There is no index.ts file, we have to create it
    // else {
    //   const data = `\nexport * from './${filenames}'`
    //   fs.writeFileSync('index.ts', data, 'utf-8');
    // }

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


//
