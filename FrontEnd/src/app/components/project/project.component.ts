import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  urlProjects =  environment.API_URL + 'projects/misProyectos'
  projects: any;
  selectedItem: any;
  ProjectName: any;
  ProjectDate: any;
  newProjectUrl = environment.API_URL + 'projects/new/?userId='
  tableShown: any;

  public newProject = {
    name: '',
    description: ''
  }

  constructor(
    private httpClient : HttpClient,
    private router : Router,
    private route : ActivatedRoute
    ) { }

  ngOnInit(): void {
    //if(environment.isLoggedIn) {
      this.getProjects();
      this.tableShown = false
    //}
  }

  private getProjects() {
    let headers = new HttpHeaders().set('auth', `${this.localToken}`)
    let promiseProjects = this.httpClient.get(this.urlProjects + '?userId=' + this.idUser, { headers }).toPromise();
    promiseProjects.then((data) => {
      this.projects = data;
    }).catch((error) => {
      //console.log(error);
      Swal.fire({
        title: 'Oops..',
        text: 'Parece que algo salio mal',
        icon: 'error', //error or success
        confirmButtonText: 'Ok'
      })
    })
  }

  printProject(that: any){
    this.tableShown = true
    this.router.navigate(['Proyectos']);
    this.ProjectName = that.name
    if(that.fechaCreacion.includes("T")){
      that.fechaCreacion = that.fechaCreacion.split("T")
    }
    this.ProjectDate = that.fechaCreacion[0]
    this.selectedItem = that.id;
  }

  seeDevelopment(that: any){
    this.router.navigate(['Equipo',that], { relativeTo: this.route });
  }
  
  seeTasks(that: any) {
    this.router.navigateByUrl('Backlog/Proyecto/' + that);
  }

  addNewProject(){
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    this.httpClient.post<any>(this.newProjectUrl + this.idUser, this.newProject, {headers}).subscribe(response => {
      if(response.msg == 'OK') {
        this.getProjects();
        this.newProject.name = '';
        this.newProject.description = '';
        Swal.fire({
          title: 'Excelente',
          text: 'Se agrego el proyecto correctamente',
          icon: 'success', //error or success
          confirmButtonText: 'Ok'
        })
      } else {
        //handdle errors
        Swal.fire({
          title: 'Oops..',
          text: 'Parece que algo salio mal',
          icon: 'error', //error or success
          confirmButtonText: 'Ok'
        })
      }
    })
  }
}
