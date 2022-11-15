import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule } from './system-routing.module';
import { SystemComponent } from './system.component';
import { AccountUserComponent } from './account-user/account-user.component';
import { AccountAdminComponent } from './account-admin/account-admin.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { IdeasComponent } from './ideas/ideas.component';
import { ParticipantsComponent } from './participants/participants.component';
import { ProjectFeedComponent } from './project-feed/project-feed.component';
import { AddIdeaComponent } from './add-idea/add-idea.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    SystemComponent,
    AccountUserComponent,
    AccountAdminComponent,
    HeaderComponent,
    FooterComponent,
    IdeasComponent,
    ProjectFeedComponent,
    ParticipantsComponent,
    AddIdeaComponent,
    MainPageComponent,
  ],
  imports: [CommonModule, SystemRoutingModule, SharedModule, FormsModule],
})
export class SystemModule {}
