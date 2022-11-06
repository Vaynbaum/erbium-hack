import { Skill } from './skill.model';
import { User } from './user.model';

export class SkillUser {
  static of(obj: any) {
    return new SkillUser(
      obj.userId ?? 0,
      obj.skillId ?? 0,
      obj.skill ? Skill.of(obj.skill) : null,
      obj.user ? User.of(obj.user) : null,
      obj.id ?? 0
    );
  }
  constructor(
    public userId: number,
    public skillId: number,
    public skill?: Skill | null,
    public user?: User | null,
    public id?: number
  ) {}
}
