import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { UserService } from './shared/services/user.service';
import { CityService } from './shared/services/city.service';
import { CountryService } from './shared/services/country.service';
import { AuthService } from './shared/services/auth.service';
import { AdminService } from './shared/services/admin.service';
import { RoleService } from './shared/services/role.service';
import { SkillService } from './shared/services/skill.service';
import { EducationService } from './shared/services/education.service';
import { EmploymentService } from './shared/services/employment.service';
import { MatMenuModule } from '@angular/material/menu';
import { NotFoundComponent } from './system/not-found/not-found.component';
import { ProjectService } from './shared/services/project.service';
import { UnloadPhotoService } from './shared/services/unload-photo.service';
import { ParticipantsComponent } from './system/participants/participants.component';
import { MyProjectsComponent } from './system/my-projects/my-projects.component';
import { MyProjectsListComponent } from './system/my-projects-list/my-projects-list.component';
import { AuthGuard } from './shared/guard/auth.guard';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    MyProjectsComponent,
    MyProjectsListComponent,
  ],

  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
  ],
  providers: [
    AuthGuard,
    UserService,
    CityService,
    CountryService,
    AdminService,
    AuthService,
    RoleService,
    SkillService,
    EducationService,
    EmploymentService,
    ProjectService,
    UnloadPhotoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
