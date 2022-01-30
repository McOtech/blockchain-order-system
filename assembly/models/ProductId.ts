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
    const arr = new Array<string>();
    for (let i = 0; i < this.ids.length; i++) {
      if (this.ids[i] != item) {
        arr.push(this.ids[i]);
      }
    }
    this.ids = arr;
  }

  showIds(): string[] {
    return this.ids;
  }
}
