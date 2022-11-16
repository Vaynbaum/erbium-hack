import { Access } from './access.model';
import { ProjectTag } from './projectTag.model';
import { Stage } from './stage.model';
import { User } from './user.model';

export class Project {
  static of(obj: any) {
    return new Project(
      obj.name ?? '',
      obj.description ?? '',
      obj.accessId ?? 0,
      obj.userId ?? 0,
      obj.stageId ?? 0,
      obj.statuses ?? [],
      obj.url ?? '',
      obj.actual ?? 0,
      obj.cost ?? 0,
      obj.id ?? 0
    );
  }
  constructor(
    public name: string,
    public description: string,
    public accessId: number,
    public userId: number,
    public stageId: number,
    public statuses: string[],
    public url: string,
    public actual: number,
    public cost: number,
    public id?: number,
    public access?: Access,
    public stage?: Stage,
    public user?: User,
    public tags?: ProjectTag[]
  ) {}
}
