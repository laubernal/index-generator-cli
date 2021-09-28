#!/usr/bin/env node

import * as fs from 'fs';
import { cwd } from 'process';
import { rootCertificates } from 'tls';

const commandPath = cwd();

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
      console.log(descendants);      

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

      // Check the descendants array and writeFileSync index.ts with the exports
      // Avoid the directories, check extension (path.extname === '.ts') 

    }
  }

  return source;
}

const directoryNode = buildDirectory(commandPath);
console.log(JSON.stringify(directoryNode, null, 2));

// const filenames = fs.readdirSync(commandPath);
// //[index.ts, test.ts, test2, test2.ts]
// //[{path:'/src/test , file: index.ts}];
// console.log('Filenames:', filenames);

// const pathMap: { [key: string]: string[] } = {};
// const filesInsideDir: string[] = [];

// const traverseDF = (fn: any) => {
//   while (filenames.length) {
//     console.log('------------------------------------------------------------');
//     // Take the first one out
//     const file = filenames.shift();
//     console.log('File:', file);

//     // Check if file is not undefined
//     if (file) {
//       console.log('Inside if statement');
//       // Obtain the current path
//       console.log('CWD:', cwd());

//       const currentPath = fs.realpathSync(file);
//       console.log('Current Path:', currentPath);

//       // Obtain the stats of the file
//       const stats = fs.lstatSync(currentPath);

//       // Check if it is a directory
//       if (stats.isDirectory()) {
//         console.log('I am a directory');

//         // Insert all files of the directoy at the beginning of the array
//         console.log('Current path inside dir:', currentPath);

//         // process.chdir(currentPath);
//         filenames.unshift(...fs.readdirSync(currentPath));
//         console.log('filenames inside dir:', filenames);

//         continue;
//       }

//       console.log('I am a file');

//       // It is a file
//       // Take out the filename of the path
//       const dirPath = currentPath.replace(`\\${file}`, '');
//       // Save in the object the path of the file as a key and the filename as a value in an array
//       filesInsideDir.push(file);
//       pathMap[dirPath] = filesInsideDir;

//       console.log('Path Map:', pathMap);
//       console.log('Updated Filenames:', filenames);

//       // Write "export * from 'file'" inside the index.ts file
//       const filenamesToExport = filesInsideDir.map(filename => {
//         // return filename.split('.ts');
//         return filename.replace('.ts', '');
//       });
//       console.log('Filenames to export:', filenamesToExport);

//       const data = `\nexport * from './${filenamesToExport[0]}';`;
//       console.log('Data:', data);

//       // fs.appendFileSync('index.ts', data, 'utf-8');
//       // There is no index.ts file, we have to create it
//       // else {
//       //   const data = `\nexport * from './${filenames}'`
//       //   fs.writeFileSync('index.ts', data, 'utf-8');
//       // }

//       fn(file);
//     }
//   }
// };

// traverseDF(console.log);

// // Create an empty array ✔
// // Read directory and fill in the array ✔
// // Shift the first element of the array and check if it is a file or a directory ✔
// // If the element is a file push it at the end of the array ✔
// // Save in an object the path (./src, ./src/A) as the key, and in an array the filenames
// // If the element is a directory check if exists a key with its path, if not create it. Unshift the children of the
// // directory
// // Once the object with the corresponding paths keys and filenames is finished check if in each key exists an index.ts
// // file and if not create it with the corresponding exports of the ts files

// // fs.readdir(currentPath, async (err, filenames) => {
// //   if (err) {
// //     console.log(err);
// //   }

// //   const statPromises = filenames.map(filename => {
// //     return fs.lstat(path.join(currentPath, filename));
// //   });

// //   const allStats = await Promise.all(statPromises);

// //   for (let stats of allStats) {
// //     const index = allStats.indexOf(stats);

// //     if (stats.isFile()) {}
// //   }
// // });

// class TreeNode {
//   // public path: string;
//   public children: Array<TreeNode> = [];

//   constructor(public path: string) {
//     // this.path = path;
//     // this.children = [];
//   }
// }

// function buildTree(rootPath: string) {
//   // console.log('Root path:', rootPath);

//   const root = new TreeNode(rootPath);

//   const stack = [root];

//   while (stack.length) {
//     // console.log('-------------------------------------');
//     console.log('Stack:', stack);

//     const currentNode = stack.shift();
//     // console.log('Current node:', currentNode);

//     if (currentNode) {
//       const children = fs.readdirSync(currentNode.path);
//       console.log('Children of current node:', currentNode.path);

//       for (let child of children) {
//         const childPath = `${currentNode.path}/${child}`;
//         // console.log('Child path:', childPath);

//         const childNode = new TreeNode(childPath);
//         currentNode.children.push(childNode);

//         if (fs.statSync(childNode.path).isDirectory()) {
//           stack.push(childNode);
//         }
//       }
//     }
//   }

//   return root;
// }

// const treeNode = buildTree(commandPath);
// console.log(JSON.stringify(treeNode, null, 2));
