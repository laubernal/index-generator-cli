import * as fs from 'fs';
import { cwd } from 'process';
import path from 'path';

import { DirectoryNode } from './DirectoryNode';
import { DATA, INDEX_FILE } from './constants';

export class DirectoryTree {
  public getCommandPath(): string {
    return cwd();
  }

  public build(sourcePath: string, fileExtension: string): DirectoryNode {
    const source = new DirectoryNode(sourcePath);

    const stack = [source];

    while (stack.length) {
      const currentElement = stack.shift();

      if (currentElement) {
        const descendants = fs.readdirSync(currentElement.path);

        this.writeIndexFile(descendants, currentElement.path, fileExtension);

        for (let descendant of descendants) {
          const descendantPath = `${currentElement.path}\\${descendant}`;
          const descendantNode = new DirectoryNode(descendantPath);
          currentElement.children.push(descendantNode);

          if (fs.statSync(descendantNode.path).isDirectory()) {
            stack.push(descendantNode);
          }
        }
      }
    }

    return source;
  }

  private writeIndexFile(descendants: string[], filePath: string, fileExtension: string): void {
    const filesToExport = descendants
      .filter(filename => {
        return (
          path.extname(filename) === fileExtension && filename != INDEX_FILE.concat(fileExtension)
        );
      })
      .map(filename => `${DATA}${filename.replace(`${fileExtension}`, '')}';`)
      .join('\n');

    fs.writeFileSync(`${filePath}\\index${fileExtension}`, filesToExport);
  }
}
