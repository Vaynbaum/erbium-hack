export class Status {
  static of(obj: any) {
    return new Status(obj.name ?? '', obj.id ?? 0);
  }
  constructor(public name: string, public id?: number) {}
}
