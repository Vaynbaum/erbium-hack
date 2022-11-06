export class Company {
  static of(obj: any) {
    return new Company(obj.name ?? '', obj.uid ?? 0);
  }
  constructor(public name: string, public uid?: number) {}
}
