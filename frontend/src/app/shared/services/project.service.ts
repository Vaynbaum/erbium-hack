import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Access } from '../models/access.model';
import { Project } from '../models/project.model';
import { ProjectTag } from '../models/projectTag.model';
import { Stage } from '../models/stage.model';
import { Status } from '../models/status.model';
import { Tag } from '../models/tag.model';
import { URL_AI, URL_DB } from '../urls';

const URL_TAGS = `${URL_DB}/tags`;
const URL_STATUSES = `${URL_DB}/statuses`;
const URL_accesses = `${URL_DB}/accesses`;
const URL_stages = `${URL_DB}/stages`;
const URL_projects = `${URL_DB}/projects`;
const URL_projectTags = `${URL_DB}/projectTags`;

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}
  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(URL_TAGS);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(URL_projects, project);
  }

  deleteProject(id: number) {
    return this.http.delete(`${URL_projects}/${id}`);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${URL_projects}/${project.id}`, project);
  }

  getAllStatuses(): Observable<Status[]> {
    return this.http.get<Status[]>(URL_STATUSES);
  }

  getAllAccesses(): Observable<Access[]> {
    return this.http.get<Access[]>(URL_accesses);
  }

  getAllStages(): Observable<Stage[]> {
    return this.http.get<Stage[]>(URL_stages);
  }

  getProjectsByUserId(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(
      `${URL_projects}?authorId=${userId}&_expand=access&_expand=stage`
    );
  }

  getTagsAI(obj: any) {
    return this.http.post(`${URL_AI}/tagtext`, obj);
  }

  getStageByName(name: string): Observable<Stage> {
    return this.http
      .get<Stage>(`${URL_stages}?name=${name}`)
      .pipe(map((stages: any) => (stages[0] ? stages[0] : undefined)));
  }

  getTagsByProjects(ids: number[]): Observable<ProjectTag[]> {
    let url = `${URL_projectTags}?_expand=tag`;
    ids.forEach((id) => {
      url += `&projectId=${id}`;
    });
    return this.http.get<ProjectTag[]>(url);
  }

  createProjectTag(tp: ProjectTag): Observable<ProjectTag> {
    return this.http.post<ProjectTag>(URL_projectTags, tp);
  }

  deleteProjectTag(id: number) {
    return this.http.delete(`${URL_projectTags}/${id}`);
  }
}
