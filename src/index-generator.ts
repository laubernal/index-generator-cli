#!/usr/bin/env node

import * as fs from 'fs';
import { cwd } from 'process';
import path from 'path';

// Obtain current path
const commandPath = cwd();
// console.log('Current path', currentPath);

const filenames = fs.readdirSync(commandPath);
console.log('Filenames:', filenames);

const pathMap: { [key: string]: string[] } = {};
const filesInsideDir: string[] = [];

const traverseDF = (fn: any) => {
  while (filenames.length) {
    // Take the first one out
    const file = filenames.shift();
    console.log('File:', file);

    // Check if file is not undefined
    if (file) {
      // Obtain the current path
      const currentPath = fs.realpathSync(file);
      console.log('Current Path: ', currentPath);

      // Obtain the stats of the file
      const stats = fs.lstatSync(currentPath);

      // Check if it is a directory
      if (stats.isDirectory()) {
        console.log('I am a directory');

        // Insert all files of the directoy at the beginning of the array
        filenames.unshift(...fs.readdirSync(currentPath));
        continue;
      }

      console.log('I am a file');

      // It is a file
      // Take out the filename of the path
      const dirPath = currentPath.replace(`\\${file}`, '');
      // Save in the object the path of the file as a key and the filename as a value in an array
      filesInsideDir.push(file);
      pathMap[dirPath] = filesInsideDir;

      console.log('Path Map:', pathMap);
      console.log('Updated Filenames:', filenames);

      // It is a file -> write "export * from 'file'" inside the index.ts file
      const filenamesToExport = filenames.map(filename => {
        return filename.split('.ts');
      });
      console.log('Filenames to export:', filenamesToExport);

      const data = `\nexport * from './${filenamesToExport[0]}';`;
      console.log('Data:', data);

      fs.appendFileSync('index.ts', data, 'utf-8');
      // There is no index.ts file, we have to create it
      // else {
      //   const data = `\nexport * from './${filenames}'`
      //   fs.writeFileSync('index.ts', data, 'utf-8');
      // }

      fn(file);
    }
  }
};

traverseDF(console.log);

// Create an empty array ✔
// Read directory and fill in the array ✔
// Shift the first element of the array and check if it is a file or a directory ✔
// If the element is a file push it at the end of the array ✔
// Save in an object the path (./src, ./src/A) as the key, and in an array the filenames
// If the element is a directory check if exists a key with its path, if not create it. Unshift the children of the
// directory
// Once the object with the corresponding paths keys and filenames is finished check if in each key exists an index.ts
// file and if not create it with the corresponding exports of the ts files

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
