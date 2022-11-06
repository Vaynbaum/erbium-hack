export class Tag {
  static of(obj: any) {
    return new Tag(obj.name ?? '', obj.id ?? 0);
  }
  constructor(public name: string, public id?: number) {}
}
