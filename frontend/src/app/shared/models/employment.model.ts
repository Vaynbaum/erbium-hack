export class Employment {
  static of(obj: any) {
    return new Employment(obj.name ?? '', obj.id ?? 0);
  }
  constructor(public name: string, public id?: number) {}
}
