export class Access {
  static of(obj: any) {
    return new Access(obj.name_en ?? '', obj.name_ru ?? '', obj.id ?? 0);
  }
  constructor(
    public name_en: string,
    public name_ru: string,
    public id?: number
  ) {}
}
