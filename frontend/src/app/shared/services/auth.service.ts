import { Injectable } from '@angular/core';
import { ADMIN, USER } from '../consts';
import { Admin } from '../models/admin.model';
import { SkillUser } from '../models/skillUser.model';
import { TeamRoleUser } from '../models/teamRoleUser.model';
import { User } from '../models/user.model';
import { RoleService } from './role.service';
import { SkillService } from './skill.service';

const KEY = 'person';
const TEAM_ROLES = 'team_roles';
const SKILLS = 'skills';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public admin: Admin | null = null;
  public user: User | null = null;
  public roleUser: TeamRoleUser[] = [];
  public skillsUser: SkillUser[] = [];

  constructor(
    private roleService: RoleService,
    private skillService: SkillService
  ) {
    const p = localStorage.getItem(KEY);
    if (p) {
      let person = JSON.parse(p);
      if (person.role.name_en == ADMIN) {
        this.admin = Admin.of(person);
      } else if (person.role.name_en == USER) {
        this.user = User.of(person);
        let rs = localStorage.getItem(TEAM_ROLES);
        let ss = localStorage.getItem(SKILLS);

        if (rs) {
          let roles = JSON.parse(rs);
          roles.forEach((role: any) => {
            this.roleUser.push(TeamRoleUser.of(role));
          });
        }
        if (ss) {
          let skills = JSON.parse(ss);
          skills.forEach((skill: any) => {
            this.skillsUser.push(SkillUser.of(skill));
          });
        }
      }
    }
  }

  addRole(role: TeamRoleUser) {
    this.roleUser.push(role);
    window.localStorage.setItem(TEAM_ROLES, JSON.stringify(this.roleUser));
  }
  deleteRole(index: number) {
    this.roleUser.splice(index, 1);
    window.localStorage.setItem(TEAM_ROLES, JSON.stringify(this.roleUser));
  }
  updateRole(index: number, role: TeamRoleUser) {
    this.roleUser[index] = role;
    window.localStorage.setItem(TEAM_ROLES, JSON.stringify(this.roleUser));
  }

  deleteSkill(index: number) {
    this.skillsUser.splice(index, 1);
    window.localStorage.setItem(SKILLS, JSON.stringify(this.skillsUser));
  }
  addSkill(skill: SkillUser) {
    this.skillsUser.push(skill);
    window.localStorage.setItem(SKILLS, JSON.stringify(this.skillsUser));
  }
  updateSkill(index: number, skill: SkillUser) {
    this.skillsUser[index] = skill;
    window.localStorage.setItem(SKILLS, JSON.stringify(this.skillsUser));
  }

  Login(person: Admin | User) {
    if (person.role?.name_en == ADMIN) {
      this.admin = Admin.of(person);
    } else if (person.role?.name_en == USER) {
      this.user = User.of(person);
      this.roleService.getRolesByUser(this.user.id, true).subscribe((roles) => {
        this.roleUser = [];
        roles.forEach((role) => {
          this.roleUser.push(TeamRoleUser.of(role));
        });
        window.localStorage.setItem(TEAM_ROLES, JSON.stringify(this.roleUser));
      });
      this.skillService
        .getSkillsByUser(this.user.id, true)
        .subscribe((skills) => {
          this.skillsUser = [];
          skills.forEach((skill) => {
            this.skillsUser.push(SkillUser.of(skill));
          });
          window.localStorage.setItem(SKILLS, JSON.stringify(this.skillsUser));
        });
    }
    window.localStorage.setItem(KEY, JSON.stringify(person));
  }

  Logout() {
    this.admin = null;
    this.user = null;
    this.roleUser = [];
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(TEAM_ROLES);
    window.localStorage.removeItem(SKILLS);
  }
  public get isLoggedIn(): boolean {
    return this.admin != null || this.user != null;
  }
}
