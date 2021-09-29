export class DirectoryNode {
  public children: Array<DirectoryNode> = [];

  constructor(public path: string) {}
}
