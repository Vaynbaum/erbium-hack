import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';
import { SkillUser } from '../models/skillUser.model';
import { URL_DB } from '../urls';
const URL_SKILLS = `${URL_DB}/skills`;
const URL_SKILLS_TO_USER = `${URL_DB}/skillsToUsers`;
@Injectable({
  providedIn: 'root',
})
export class SkillService {
  constructor(private http: HttpClient) {}
  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(URL_SKILLS);
  }
  deleteSkillFromUser(id: any) {
    return this.http.delete(`${URL_SKILLS_TO_USER}/${id}`);
  }

  addSkillToUser(skill: SkillUser): Observable<SkillUser> {
    return this.http.post<SkillUser>(URL_SKILLS_TO_USER, skill);
  }

  getSkillsByUser(
    userId: any,
    skill?: boolean,
    user?: boolean
  ): Observable<SkillUser[]> {
    return this.http.get<SkillUser[]>(
      `${URL_SKILLS_TO_USER}?userId=${userId}${skill ? '&_expand=skill' : ''}${
        user ? '&_expand=user' : ''
      }`
    );
  }
  getSkillsToUsers():Observable<any[]> {
    return this.http.get<any[]>(`${URL_SKILLS_TO_USER}?_expand=skill`);
  }
}
