import { Specialization } from './specialization.model';
import { University } from './university.model';

export class Education {
  static of(obj: any) {
    return new Education(
      obj.university ? University.of(obj.university) : null,
      obj.specialization ? Specialization.of(obj.specialization) : null,
      obj.yearGraduation ?? 0
    );
  }
  constructor(
    public university: University | null,
    public specialization: Specialization | null,
    public yearGraduation: number
  ) {}
}
