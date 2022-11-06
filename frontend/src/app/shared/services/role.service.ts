import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { TeamRole } from '../models/teamRole.model';
import { TeamRoleUser } from '../models/teamRoleUser.model';
import { URL_DB } from '../urls';

const URL_ROLES = `${URL_DB}/roles`;
const URL_TEAM_ROLES = `${URL_DB}/teamRoles`;
const URL_TEAM_ROLES_TO_USER = `${URL_DB}/teamRolesToUsers`;

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}
  getRoleByName(name: string): Observable<Role> {
    return this.http
      .get<Role>(`${URL_ROLES}/?name_en=${name}`)
      .pipe(map((roles: any) => (roles[0] ? roles[0] : undefined)));
  }

  getAllTeamRoles(): Observable<TeamRole[]> {
    return this.http.get<TeamRole[]>(URL_TEAM_ROLES);
  }

  addRoleToUser(role: TeamRoleUser): Observable<TeamRoleUser> {
    return this.http.post<TeamRoleUser>(URL_TEAM_ROLES_TO_USER, role);
  }
  deleteRoleFromUser(id: any) {
    return this.http.delete(`${URL_TEAM_ROLES_TO_USER}/${id}`);
  }

  getRolesByUser(
    userId: any,
    role?: boolean,
    user?: boolean
  ): Observable<TeamRoleUser[]> {
    return this.http.get<TeamRoleUser[]>(
      `${URL_TEAM_ROLES_TO_USER}?userId=${userId}${
        role ? '&_expand=teamRole' : ''
      }${user ? '&_expand=user' : ''}`
    );
  }

  getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${URL_TEAM_ROLES_TO_USER}?_expand=teamRole`)
  }
}
