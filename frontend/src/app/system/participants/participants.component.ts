import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, TitleStrategy } from '@angular/router';
import { User } from 'src/app/shared/models/user.model';
import { RoleService } from 'src/app/shared/services/role.service';
import { SkillService } from 'src/app/shared/services/skill.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
})
export class ParticipantsComponent implements OnInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private userService: UserService,
    private roleService: RoleService,
    private skillService: SkillService
  ) {
    renderer.listen('document', 'click', (event: Event) => {
      let targets = [
        'name-input',
        'skills-input',
        'roles-input',
        'city-input',
        'finder-icon',
        'select-icon',
        'drop',
        'drop-options',
      ];
      //@ts-ignore
      let target = event.target.id;
      if (targets.indexOf(target) == -1) {
        this.namesFilter = [];
        this.skillsFilter = [];
        this.rolesFilter = [];
        this.citiesFilter = [];
        this.resetFilters(true, true, true, true);
      } else if (target == targets[0]) {
        this.resetFilters(false, true, true, true);
      } else if (target == targets[1]) {
        this.resetFilters(true, false, true, true);
      } else if (target == targets[2]) {
        this.resetFilters(true, true, false, true);
      } else if (target == targets[3]) {
        this.resetFilters(true, true, true, false);
      }
    });
  }

  resetFilters(
    name: boolean = false,
    skills: boolean = false,
    roles: boolean = false,
    city: boolean = false
  ) {
    if (name) {
      this.namesFilter = [];
    }
    if (skills) {
      this.skillsFilter = [];
    }
    if (roles) {
      this.rolesFilter = [];
    }
    if (city) {
      this.citiesFilter = [];
    }
  }

  users: any[] = [];
  usersFilter: any[] = [];

  names: string[] = [];
  skills: string[] = [];
  roles: string[] = [];
  cities: string[] = [];

  namesFilter: string[] = [];
  skillsFilter: string[] = [];
  rolesFilter: string[] = [];
  citiesFilter: string[] = [];

  nameValue: string = '';
  skillsValue: string = '';
  rolesValue: string = '';
  citiesValue: string = '';

  ngOnInit(): void {
    this.userService.getAllParticipants().subscribe((users: User[]) => {
      this.roleService.getAllRoles().subscribe((roles: any[]) => {
        this.roles = roles.map((role: any) => {
          return role.teamRole.name;
        });
        this.roles = [...new Set(this.roles)];

        this.skillService.getSkillsToUsers().subscribe((skills: any) => {
          this.skills = skills.map((skill: any) => {
            return skill.skill.name;
          });
          this.skills = [...new Set(this.skills)];
          this.users = users.map((user: any) => {
            let role = roles.filter((role: any) => {
              if (role.userId == user.id) return true;
              else return false;
            });
            let skill = skills.filter((skill: any) => skill.userId == user.id);
            let name = `${user.lastname} ${user.firstname} ${user.patronymic}`;
            this.names.push(name);
            let city = user.city.name;
            if (this.cities.indexOf(city) == -1) {
              this.cities.push(city);
            }
            return {
              ...user,
              role,
              skill,
            };
          });
          this.usersFilter = [...this.users];
        });
      });
    });
  }

  onNameChange(event: any) {
    this.nameValue = event.target.value;
    if (this.nameValue == '') {
      this.namesFilter = [];
    } else {
      this.namesFilter = this.names.filter(
        (name: string) =>
          name.toLowerCase().indexOf(this.nameValue.toLowerCase()) != -1
      );
    }
  }

  setName(value: string) {
    this.nameValue = value;
    this.namesFilter = [];
    this.skillsValue = '';
    this.rolesValue = '';
    this.citiesValue = '';
    this.usersFilter = this.users.filter(
      (user: any) =>
        `${user.lastname} ${user.firstname} ${user.patronymic}` ==
        this.nameValue
    );
  }

  setSkill(value: string) {
    if (this.skillsValue.indexOf(value) == -1) {
      let skills = this.skillsValue.split(', ');
      if (skills[0] == '') {
        this.skillsValue = value;
      } else {
        skills.push(value);
        this.skillsValue = skills.join(', ');
      }
    } else {
      this.skillsValue = this.skillsValue
        .split(', ')
        .filter((skill: string) => skill != value)
        .join(', ');
    }
  }

  setRole(value: string) {
    if (this.rolesValue.indexOf(value) == -1) {
      let roles = this.rolesValue.split(', ');
      if (roles[0] == '') {
        this.rolesValue = value;
      } else {
        roles.push(value);
        this.rolesValue = roles.join(', ');
      }
    } else {
      this.rolesValue = this.rolesValue
        .split(', ')
        .filter((role: string) => role != value)
        .join(', ');
    }
  }

  onCitiesChange(event: any) {
    this.citiesValue = event.target.value;
    if (this.citiesValue == '') {
      this.citiesFilter = [];
    } else {
      this.citiesFilter = this.cities.filter(
        (city: string) =>
          city.toLowerCase().indexOf(this.citiesValue.toLowerCase()) != -1
      );
    }
  }

  setCity(value: string) {
    if (this.citiesValue.indexOf(value) == -1) {
      let cities = this.citiesValue.split(', ');
      if (cities[0] == '') {
        this.citiesValue = value;
      } else {
        cities.push(value);
        this.citiesValue = cities.join(', ');
      }
    } else {
      this.citiesValue = this.citiesValue
        .split(', ')
        .filter((city: string) => city != value)
        .join(', ');
    }
  }

  reset() {
    this.nameValue = '';
    this.skillsValue = '';
    this.rolesValue = '';
    this.citiesValue = '';
    this.usersFilter = [...this.users];
  }

  filter() {
    let skills =
      this.skillsValue.length != 0 ? this.skillsValue.split(', ') : [];
    let roles = this.rolesValue.length != 0 ? this.rolesValue.split(', ') : [];
    let cities =
      this.citiesValue.length != 0 ? this.citiesValue.split(', ') : '';
    if (skills.length != 0 || roles.length != 0 || cities != '') {
      this.usersFilter = this.users.filter((user: any) => {
        if (skills.length != 0) {
          let count = 0;
          user.skill.forEach((skill: any) => {
            if (skills.indexOf(skill.skill.name) != -1) {
              count++;
            }
          });
          if (count == 0) {
            return false;
          }
        }
        if (roles.length != 0) {
          let count = 0;
          user.role.forEach((role: any) => {
            if (roles.indexOf(role.teamRole.name) != -1) {
              count++;
            }
          });
          if (count == 0) {
            return false;
          }
        }
        if (cities.length != 0) {
          if (cities.indexOf(user.city.name) == -1) {
            return false;
          }
        }
        return true;
      });
    }
  }
}
