#!/usr/bin/env node

import * as fs from 'fs';
import { cwd } from 'process';

// Obtain current path
const currentPath = cwd();
// console.log('Current path', currentPath);

const filenames = fs.readdirSync(currentPath);
console.log('filenames:', filenames);

const pathMap: { [key: string]: string[] } = {};

const traverseDF = (fn: any) => {
  while (filenames.length) {
    // Check if there is an index.ts file inside the directory
    // const indexFile = filenames.find((filename: string) => {
    //   return filename === 'index.ts';
    // });

    // Take the first one out
    const file = filenames.shift();
    console.log('File:', file);

    // Check if file is not undefined
    if (file) {
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

      // It is a file
      // Save in the object the path of the file as a key and the filename as a value in an array
      pathMap[currentPath] = [...pathMap[currentPath], file];

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
