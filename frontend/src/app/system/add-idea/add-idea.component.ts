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
  allAccessOrigins: any[] = [];
  allCategories: any;
  categoryCtrl = new FormControl('');
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
    if (name && description && access) {
      this.data.idea.name = name;
      this.data.idea.description = description;
      this.data.idea.stageId = this.ideaStage?.id;
      const ac = this.allAccessOrigins.find((a) => a.name_ru == access);
      this.data.idea.accessId = ac.id;
    }
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
