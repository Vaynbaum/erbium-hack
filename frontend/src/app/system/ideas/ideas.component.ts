import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ADD, EDIT } from 'src/app/shared/consts';
import { Idea } from 'src/app/shared/models/idea.model';
import { Project } from 'src/app/shared/models/project.model';
import { ProjectTag } from 'src/app/shared/models/projectTag.model';
import { Tag } from 'src/app/shared/models/tag.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProjectService } from 'src/app/shared/services/project.service';
import { OWN_URL_FOR_IMAGE } from 'src/app/shared/urls';
import { AddIdeaComponent } from '../add-idea/add-idea.component';
export interface DialogData {
  idea: Idea;
  action: string;
  project?: Project;
  actual?: number;
}
@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss'],
})
export class IdeasComponent implements OnInit {
  projects: Project[] = [];
  constructor(
    private projectService: ProjectService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}
  compileUrl(url: any) {
    if (url.indexOf('http') >= 0) return url;
    else return `${OWN_URL_FOR_IMAGE}/${url ? url : 'default-image.jpg'}`;
  }
  ngOnInit(): void {
    this.projectService
      .getProjectsByUserId(this.authService.user?.id as number)
      .subscribe((projects) => {
        this.projects = projects;
        let ids: number[] = [];
        this.projects.forEach((project) => {
          project.tags = [];
          ids.push(project.id as number);
        });
        this.projectService.getTagsByProjects(ids).subscribe((tags) => {
          tags.forEach((tag) => {
            let project = this.projects.find(
              (project) => tag.projectId === project.id
            );
            if (project) {
              project.tags?.push(tag);
            }
          });
        });
      });
  }
  convertIdeaToProject(idea: Idea, actual: any) {
    let p = new Project(
      idea.name as string,
      idea.description as string,
      idea.accessId as number,
      idea.authorId as number,
      idea.stageId as number,
      [],
      idea.url as string,
      0,
      0
    );
    
    p.actual = actual;
    return p;
  }
  editIdea(project: Project) {
    let tags = project.tags?.map((tag) => tag.tag);
    let idea = new Idea(
      project.name,
      project.description,
      project.accessId,
      project.authorId,
      project.stageId,
      project.url,
      tags as Tag[]
    );
    const dialogRef = this.dialog.open(AddIdeaComponent, {
      width: '80%',
      data: {
        idea: idea,
        action: EDIT,
        project: project,
      },
    });

    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        if (result.action == EDIT) {
          let idea = result.idea;
          let tags = result?.project?.tags;
          let convPr = this.convertIdeaToProject(idea, result.actual);
          convPr.id = result?.project?.id;
          let tagToAdd: ProjectTag[] = [];

          idea.tags?.forEach((tag) => {
            let find = tags?.find((t) => t.tagId == tag.id);
            if (!find) {
              let tagDisp = new ProjectTag(
                tag.id as number,
                project.id as number
              );
              tagDisp.tag = tag;
              tagToAdd.push(tagDisp);

              this.projectService
                .createProjectTag(
                  new ProjectTag(tag.id as number, project.id as number)
                )
                .subscribe((t) => {
                  let findTag = project.tags?.find((ta) => ta.tagId == t.tagId);
                  if (findTag) findTag.id = t.id;
                });
            }
          });

          tags?.forEach((tag) => {
            let find = idea.tags?.find((t) => t.id == tag.tagId);
            if (!find) {
              this.projectService
                .deleteProjectTag(tag.id as number)
                .subscribe(() => {});
            }
          });

          this.projectService.updateProject(convPr).subscribe((projUp) => {
            const ind = this.projects.indexOf(project);
            if (ind >= 0) {
              this.projects[ind] = projUp;
              this.projectService
                .getTagsByProjects([projUp.id as number])
                .subscribe((tags: any[]) => {
                  projUp.tags = tags;
                });
            }
          });

          // idea.tags?.forEach((tag) => {
          //   let find = tags?.find((t) => t.tagId == tag.id);
          //   if (!find) {
          //     this.projectService
          //       .createProjectTag(
          //         new ProjectTag(tag.id as number, project.id as number)
          //       )
          //       .subscribe(() => {});
          //   }
          // });

          // tags?.forEach((tag) => {
          //   let find = idea.tags?.find((t) => t.id == tag.tagId);
          //   if (!find) {
          //     this.projectService
          //       .deleteProjectTag(tag.id as number)
          //       .subscribe(() => {});
          //   }
          // });

          // this.projectService.updateProject(convPr).subscribe((projUp) => {
          //   const ind = this.projects.indexOf(project);
          //   if (ind >= 0) {
          //     this.projects[ind] = projUp;
          //     this.projectService
          //       .getTagsByProjects([projUp.id as number])
          //       .subscribe((tags: any[]) => {
          //         projUp.tags = tags;
          //       });
          //   }
          // });
        }
      }
    });
  }

  addIdea() {
    let idea = new Idea('', '', 0, this.authService.user?.id, 0, '', []);
    const dialogRef = this.dialog.open(AddIdeaComponent, {
      width: '80%',
      data: {
        idea: idea,
        action: ADD,
      },
    });
    dialogRef.afterClosed().subscribe((result: DialogData) => {
      if (result) {
        if (result.action == ADD) {
          let idea = result.idea;
          let project = this.convertIdeaToProject(idea, result.actual);
          this.projectService.createProject(project).subscribe((pr) => {
            project = pr;
            project.tags = [];
            this.projects.push(project);
            idea.tags?.forEach((tag) => {
              let tp = new ProjectTag(tag.id as number, pr.id as number);
              this.projectService.createProjectTag(tp).subscribe((pr) => {
                pr.tag = tag;
                project.tags?.push(pr);
              });
            });
          });
        }
      }
    });
  }
}
