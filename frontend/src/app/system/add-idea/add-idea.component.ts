import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, startWith } from 'rxjs/operators';
import { Stage } from 'src/app/shared/models/stage.model';
import { Tag } from 'src/app/shared/models/tag.model';
import { ProjectService } from 'src/app/shared/services/project.service';
import { UnloadPhotoService } from 'src/app/shared/services/unload-photo.service';
import { URL_UPLOAD_IMAGE } from 'src/app/shared/urls';
import { DialogData } from '../ideas/ideas.component';

@Component({
  selector: 'app-add-idea',
  templateUrl: './add-idea.component.html',
  styleUrls: ['./add-idea.component.scss'],
})
export class AddIdeaComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private projectService: ProjectService,
    private unloadPhotoService: UnloadPhotoService
  ) {}
  form = new FormGroup({
    name: new FormControl(this.data.idea.name, [Validators.required]),
    description: new FormControl(this.data.idea.description, [
      Validators.required,
    ]),
    access: new FormControl('', [Validators.required]),
  });
  expandStage: Stage | null = null;
  expandForm = new FormGroup({
    problem: new FormControl(this.data.idea.problem, [Validators.required]),
    audience: new FormControl(this.data.idea.audience, [Validators.required]),
    calendarPlan: new FormControl(this.data.idea.calendarPlan, [
      Validators.required,
    ]),
    cost: new FormControl(this.data.idea.cost, [
      Validators.required,
      Validators.min(0),
    ]),
    affect: new FormControl(this.data.idea.affect, [Validators.required]),
    planGrow: new FormControl(this.data.idea.planGrow, [Validators.required]),
  });
  expand = this.data.idea.problem ? true : false;
  allAccessOrigins: any[] = [];
  allCategories: any;
  categoryCtrl = new FormControl('');
  actual: number = 11;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ideaStage: Stage | null = null;
  compile_values(arr: any[], form: any) {
    return form.valueChanges.pipe(
      startWith(null),
      map((item: any) => (item ? this._filterValues(item, arr) : arr.slice()))
    );
  }
  private _filterValues(value: string, values: any[]) {
    console.log(value);
    const filterValue = value.toLowerCase();
    return values.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }
  @ViewChild('categoryInput') categoryInput: any;
  removeCategory(tag: Tag) {
    const index = this.data.idea.tags?.indexOf(tag);
    if (index != undefined && index >= 0) {
      this.data.idea.tags?.splice(index, 1);
    }
  }
  colors = [
    '#EB0901',
    '#EB2600',
    '#EB5500',
    '#EB7001',
    '#EB9401',
    '#EBAF00',
    '#EBCA00',
    '#6CEB03',
    '#01EB24',
    '#00EB4B',
  ];
  selectedCategory(event: MatAutocompleteSelectedEvent) {
    const value = event.option.viewValue;
    let tag = this.allCategories.find((tag: any) => tag.name == value);
    if (tag && !this.data.idea.tags?.find((t: any) => t.name == value)) {
      this.data.idea.tags?.push(tag);
    }
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }
  onOpenFileDialog() {
    document.getElementById('file-input')?.click();
  }

  saveIdea() {
    const { name, description, access } = this.form.value;
    const { problem, audience, calendarPlan, cost, affect, planGrow } =
      this.expandForm.value;

    if (name && description && access) {
      this.data.idea.name = name;
      this.data.idea.description = description;
      this.data.idea.stageId = this.ideaStage?.id;
      const ac = this.allAccessOrigins.find((a) => a.name_ru == access);
      this.data.idea.accessId = ac.id;
    }
    if (this.expandForm.valid) {
      //@ts-ignore
      this.data.idea.problem = problem; //@ts-ignore
      this.data.idea.audience = audience; //@ts-ignore
      this.data.idea.calendarPlan = calendarPlan; //@ts-ignore
      this.data.idea.cost = cost; //@ts-ignore
      this.data.idea.affect = affect; //@ts-ignore
      this.data.idea.planGrow = planGrow;
    }
  }

  growToProject() {
    this.saveIdea();
    this.data.idea.stageId = this.expandStage?.id;
  }

  getTagsAI() {
    const { description } = this.form.value;
    this.projectService
      .getTagsAI({
        text: description,
      })
      .subscribe((res: any) => {
        res.tags.forEach((tag: string) => {
          let t = this.allCategories.find((ta: any) => ta.name == tag);
          if (t && !this.data.idea.tags?.find((ta: any) => ta.name == tag)) {
            this.data.idea.tags?.push(t);
          }
        });
        this.projectService
          .getActual(this.data.idea.tags?.[0].name, description)
          .subscribe((res: any) => {
            this.actual = res.txtsim;
            this.data.actual = this.actual;
          });
      });
  }

  async fileChange(event: any) {
    let fileList: FileList = event.target.files;
    if (!fileList.length) {
      return;
    }
    let image = fileList[0];

    try {
      const { data } = await this.unloadPhotoService.unload(image);
      this.data.idea.url = `${URL_UPLOAD_IMAGE}/${data}`;
      console.log(data);
    } catch (error) {
      console.log(console.error);
    }
  }
  expend() {
    this.expand = true;
    this.projectService
      .getStageByName('Проект. Разработка')
      .subscribe((stage) => {
        this.expandStage = stage;
      });
  }
  ngOnInit(): void {
    this.projectService.getAllAccesses().subscribe((accesses) => {
      this.allAccessOrigins = accesses;
      let a = this.allAccessOrigins.find(
        (access) => access.id == this.data.idea.accessId
      );
      this.form.get('access')?.setValue(a?.name_ru);
    });
    this.projectService.getAllTags().subscribe((tags) => {
      this.allCategories = tags;
    });
    this.projectService.getStageByName('Идея').subscribe((stage) => {
      this.ideaStage = stage;
    });
  }
}
