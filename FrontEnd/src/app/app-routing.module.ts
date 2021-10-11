import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms'
import { ProjectComponent } from './components/project/project.component';
import { AbouttoComponent } from './components/aboutto/aboutto.component';
import { UserComponent } from './components/user/user.component';
import { TeamComponent } from './components/team/team.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { BacklogComponent } from './components/backlog/backlog.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { RegisterComponent } from './components/register/register.component';

import { ChatComponent } from "./components/chat/chat.component";
import { InvitacionesComponent } from "./components/invitaciones/invitaciones.component";
import { ChartComponent } from "./components/chart/chart.component";
import { KanbanComponent } from "./components/kanban/kanban.component";


const routes: Routes = [
  {
    path:'',
    component: LoginComponent
  },
  {
    path:'Proyectos',
    component: ProjectComponent,
    children: [
      {
        path: 'Equipo/:id',
        component: TeamComponent
      }
    ]
  },
  {
    path: 'Backlog/Proyecto/:id',
    component: TasksComponent,
    children: [
      {
        path: 'Sprint/:idSprint',
        component: BacklogComponent
      }
    ]
  },
  {
    path: 'Acerca',
    component: AbouttoComponent
  }, 
  {
    path: 'Mi-Perfil',
    component: UserComponent
  },
  {
    path: 'Agenda',
    component: ScheduleComponent
  },
  {path: 'chat', component:ChatComponent },
  {path: 'Invitacion', component:InvitacionesComponent},
  {path: 'grafica', component:ChartComponent},
  {path: 'kanban', component:KanbanComponent},
  {
    path: 'Registrar',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), FormsModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }