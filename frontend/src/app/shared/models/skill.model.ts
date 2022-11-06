export class Skill {
  static of(obj: any) {
    return new Skill(obj.name ?? '', obj.id ?? 0);
  }
  constructor(public name: string, public id?: number) {}
}
