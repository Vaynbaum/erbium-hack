export class Specialization {
  static of(obj: any) {
    return new Specialization(obj.name ?? '', obj.id ?? 0);
  }
  constructor(public name: string, public id?: number) {}
}
