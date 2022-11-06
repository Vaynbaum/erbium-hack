export class Country {
  static of(obj: any) {
    return new Country(obj.name ?? '', obj.id ?? 0, obj.url ?? '');
  }
  constructor(public name: string, public id?: number, public url?: string) {}
}
