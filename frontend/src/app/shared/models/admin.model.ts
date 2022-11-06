import { Role } from './role.model';

export class Admin {
  static of(obj: any) {
    return new Admin(
      obj.email ?? '',
      obj.password ?? '',
      obj.lastname ?? '',
      obj.firstname ?? '',
      obj.patronymic ?? '',
      obj.superAdmin ?? false,
      obj.roleId ?? 0,
      obj.id ?? 0,
      obj.role ? Role.of(obj.role) : null
    );
  }
  clone(): Admin {
    return new Admin(
      this.email,
      this.password,
      this.lastname,
      this.firstname,
      this.patronymic,
      this.superAdmin,
      this.roleId,
      this.id
    );
  }
  constructor(
    public email: string,
    public password: string,
    public lastname: string,
    public firstname: string,
    public patronymic: string,
    public superAdmin: boolean,
    public roleId: number,
    public id?: number,
    public role?: Role | null
  ) {}
}
