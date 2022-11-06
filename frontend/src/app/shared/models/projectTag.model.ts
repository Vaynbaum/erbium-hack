import { Project } from './project.model';
import { Tag } from './tag.model';

export class ProjectTag {
  constructor(
    public tagId: number,
    public projectId: number,
    public id?: number,
    public tag?: Tag,
    public project?: Project
  ) {}
}
