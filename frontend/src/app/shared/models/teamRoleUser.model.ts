import { TeamRole } from './teamRole.model';
import { User } from './user.model';

export class TeamRoleUser {
  static of(obj: any) {
    return new TeamRoleUser(
      obj.userId ?? 0,
      obj.teamRoleId ?? 0,
      obj.teamRole ? TeamRole.of(obj.teamRole) : null,
      obj.user ? User.of(obj.user) : null,
      obj.id ?? 0
    );
  }
  constructor(
    public userId: number,
    public teamRoleId: number,
    public teamRole?: TeamRole | null,
    public user?: User | null,
    public id?: number
  ) {}
}
