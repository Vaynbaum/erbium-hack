import { Tag } from './tag.model';

export class Idea {
  constructor(
    public name?: string,
    public description?: string,
    public accessId?: number,
    public authorId?: number,
    public stageId?: number,
    public url?: string,
    public tags?: Tag[],
    public problem?: string,
    public audience?: string,
    public calendarPlan?: string,
    public cost?: number,
    public affect?: string,
    public planGrow?: string
  ) {}
}
