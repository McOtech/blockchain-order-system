@nearBindgen
export class ProductId {
  ids: string[];

  constructor() {
    this.ids = new Array<string>();
  }

  add(item: string): void {
    this.ids.push(item);
  }

  remove(item: string): void {
    const tIds = this.ids.filter((item) => item != item);
    this.ids = tIds;
  }

  showIds(): string[] {
    return this.ids;
  }
}
