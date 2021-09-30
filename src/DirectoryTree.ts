import * as fs from 'fs';
import { cwd } from 'process';
import path from 'path';

import { DirectoryNode } from './DirectoryNode';
import { DATA, DEFAULT_EXTENSION, INDEX_FILE } from './constants';

export class DirectoryTree {
  public getCommandPath() {
    return cwd();
  }

  public buildDirectoryTree(sourcePath: string) {
    const source = new DirectoryNode(sourcePath);

    const stack = [source];

    while (stack.length) {
      const currentElement = stack.shift();

      if (currentElement) {
        const descendants = fs.readdirSync(currentElement.path);

        this.writeIndexFile(descendants, currentElement.path);

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

  private writeIndexFile(descendants: string[], filePath: string): void {
    const filesToExport = descendants
      .filter(filename => {
        return (
          path.extname(filename) === this.fileExtension() &&
          filename != INDEX_FILE.concat(this.fileExtension())
        );
      })
      .map(filename => `${DATA}${filename.replace(`${this.fileExtension()}`, '')}';`)
      .join('\n');

    fs.writeFileSync(`${filePath}\\index.ts`, filesToExport);
  }

  private fileExtension(): string {
    if (typeof process.argv.slice(2)[0] === 'undefined') {
      return DEFAULT_EXTENSION;
    }
    return process.argv.slice(2)[0];
  }
}
