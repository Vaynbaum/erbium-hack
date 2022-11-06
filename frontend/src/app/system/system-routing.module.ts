import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountAdminComponent } from './account-admin/account-admin.component';
import { AccountUserComponent } from './account-user/account-user.component';

import { MyProjectsListComponent } from './my-projects-list/my-projects-list.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';

import { IdeasComponent } from './ideas/ideas.component';
import { NotFoundComponent } from './not-found/not-found.component';

import { ParticipantsComponent } from './participants/participants.component';
import { ProjectFeedComponent } from './project-feed/project-feed.component';

import { SystemComponent } from './system.component';
import { AuthGuard } from '../shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'account_user', component: AccountUserComponent },
      { path: 'my-projects', component: MyProjectsComponent },
      { path: 'my-projects-list', component: MyProjectsListComponent },
      { path: 'account_admin', component: AccountAdminComponent },
      { path: 'project-feed', component: ProjectFeedComponent },
      { path: 'participants', component: ParticipantsComponent },
      { path: 'ideas', component: IdeasComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
