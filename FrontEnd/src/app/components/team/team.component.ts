import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')
  localUser:any = localStorage.getItem('user');
  urlTeam =  environment.API_URL;
  idProject: any;
  user: any;
  teams: any [] = [];
  teamUser: any[] = [];
  newPartnerArray: any [] = [];
  idUserLocal: any;
  roleUser:any;
  aux: any;

  public newPartner = {
    email: '',
    rol: ''
  }

  constructor(
    private httpClient : HttpClient,
    private route : ActivatedRoute
  ) {
    this.idUserLocal=JSON.parse(this.localUser)["userId"];
   }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.idProject = params['id'];
    });

    let headers = new HttpHeaders().set('auth', `${this.localToken}`);

    let PromiseUserbyId = this.httpClient.get(this.urlTeam + 'urp/equipo/?projectId=' + this.idProject + '&userId=' + this.idUserLocal, { headers }).toPromise();
    await PromiseUserbyId.then((data) => {
      this.aux = data
      for(let i = 0; i < this.aux.length; i++) {
        if(this.aux[i]['id'] == this.idUserLocal){
          this.roleUser = this.aux[i]['rol']
        }
      }
    }).catch((error) => {
      console.log(error);
    })

    
    let promiseDevelopmentTeam = this.httpClient.get(this.urlTeam + 'urp/equipo/?projectId=' + this.idProject + '&userId=' + this.idUser, { headers }).toPromise();
    promiseDevelopmentTeam.then((data) => {
      this.getAlllUsers(data);
    }).catch((error) => {
      //console.log(error);
      Swal.fire({
        title: 'Oops..',
        text: 'Este proyecto no tiene integrantes',
        icon: 'error', //error or success
        confirmButtonText: 'Ok'
      })
    })
  }

  async getAlllUsers(these: any) {
    for(let i = 0; i < these.length; i++) {

      let PromiseUserbyId = this.httpClient.get(this.urlTeam + 'users/' + these[i].userId).toPromise();
      await PromiseUserbyId.then((data) => {
        this.user = data

        this.teamUser.push({
          "id" : these[i].userId,
          "name" : this.user.firstName +  ' ' +this.user.lastName,
          "role" : these[i].rol,
          "email" : this.user.email
        });

      }).catch((error) => {
        console.log(error);
      })
    }

    this.teams = this.teamUser
  }

  async addNewTeamPartner(){
    this.newPartnerArray[0] = this.newPartner
    let headers = new HttpHeaders().set('auth', `${this.localToken}`);
    await this.httpClient.post<any>(this.urlTeam + 'projects/generarInv/?projectId=' + this.idProject + '&userId=' + this.idUser, this.newPartnerArray, {headers}).subscribe(response => {
      if(response.msg != 'Se enviaron todos los correos') {
        this.newPartner.email = ''
        this.newPartner.rol = ''
        Swal.fire({
          title: 'Excelente',
          text: 'Se enviaron todos los correos',
          icon: 'success', //error or success
          confirmButtonText: 'Ok'
        })
      } else {
        Swal.fire({
          title: 'Oops..',
          text: 'Parece que algo salio mal',
          icon: 'error', //error or success
          confirmButtonText: 'Ok'
        })      }
    })
  }
}
