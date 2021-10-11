import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { UserComponent } from './components/user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectComponent } from './components/project/project.component';
import { TeamComponent } from './components/team/team.component';
import { LoginComponent } from './components/login/login.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { AbouttoComponent } from './components/aboutto/aboutto.component';
import { FormsModule } from '@angular/forms';

import { TasksComponent } from './components/tasks/tasks.component';
import { BacklogComponent } from './components/backlog/backlog.component';
import { InvitacionesComponent } from './components/invitaciones/invitaciones.component';
import { ChatComponent } from './components/chat/chat.component';

import { ChartComponent } from './components/chart/chart.component';
import { ChartsModule } from "ng2-charts";
import { KanbanComponent } from './components/kanban/kanban.component';
import { RegisterComponent } from './components/register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserComponent,
    ProjectComponent,
    TeamComponent,
    LoginComponent,
    ScheduleComponent,
    AbouttoComponent,
    TasksComponent,
    BacklogComponent,
    InvitacionesComponent,
    ChatComponent,
    ChartComponent,
    KanbanComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
