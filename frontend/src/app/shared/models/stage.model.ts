export class Stage {
  static of(obj: any) {
    return new Stage(obj.name ?? '', obj.id ?? 0);
  }
  constructor(public name: string, public id?: number) {}
}
