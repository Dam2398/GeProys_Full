import { Component, OnInit } from '@angular/core';


import { ChatService } from "src/app/service/chat.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  storedToDos:any = localStorage.getItem('user');
  projectId: any;

  userName: string;
  userId:string;
  message: string ;
  notification :string;
  output: any[] = [];
  outnot: any[] = [];
  feedback: string ;
  pStyle:string;

  constructor(private chatSvc:ChatService,
              private route: ActivatedRoute,
              private router: Router) { 
    this.userId=JSON.parse(this.storedToDos)["userId"];
    this.userName=JSON.parse(this.storedToDos)["username"];//lo manda al handle
    this.message ='';
    this.feedback='';
    this.notification='';
    this.pStyle='';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'];//Id del proyecto
    })

    this.chatSvc.listen('user-connected').subscribe((data) => this.userConnected(data));
    this.chatSvc.listen('typing').subscribe((data) => this.updateFeedback(data));
    this.chatSvc.listen('user-disconnected').subscribe((data)=>this.userDisconnected(data));


    this.chatSvc.emit2('room-created','c'+this.projectId,this.userId);//ya funciona
    this.chatSvc.emit2('new-user','c'+this.projectId,this.userId);//ya funciona


    //aqui
    this.chatSvc.listen('chat-message').subscribe((data)=> this.updateMessage(data));//ya recibe la info


    //this.chatSvc.listen('error').subscribe((data)=>console.log(data));
    this.chatSvc.listen('mal').subscribe((data)=>this.mal(data));

    this.chatSvc.listen('old-msg').subscribe((data)=>this.displayMsg(data));

  }

  userDisconnected(name:any){
    this.feedback='';
    if(!!!name) return;
    this.output.push({
      id: '',
      msg:`🔻${name} is disconnected`,
      fecha: ''
    });
  }

  updateFeedback(miembro: any){
    this.feedback = `${miembro} is typing a message`;
  }

  userConnected(name:any){
    this.feedback='';
    if(!!!name) return;
    this.output.push({
      id: '',
      msg:`🟢${name} has connected`,
      fecha: ''
    });
  }



  displayMsg(data:any){
    this.feedback = '';
    if(!!!data) return;
    //console.log(data);            IMPRIMIR
    //console.log(`${data.name}: ${data.message}`);//YA FUNCIONA
    for (let i = 0; i < data.length; i++) {
      const yy = data[i].fechaCreacion.toString();
      const mm= yy.substr(0, 10);
      this.output.push({
        id : data[i].userId,
        msg: `${data[i].message}`,
        fecha: mm
      });
    };
    //console.log(this.output);       IMPRIMIR
  }

  mal(data:any){
    this.router.navigate(['Proyectos']);

  }


  updateMessage(data:any) {//solo pone el mensaje en el feedback
    this.feedback = '';
    if(!!!data) return;
    //console.log(`${data.name}: ${data.message}`);//YA FUNCIONA
    this.output.push({
      id: '',
      msg: data,
      fecha: ''
    });
  }

  sendMessage(): void {//si envia al servidor
    this.chatSvc.emit3('send-chat-message','c'+this.projectId,`${this.userName}: ${this.message}`,this.userId);
    //this.chat?.append(`<p class="msg">YOU: ${this.message}</p>`)
    this.output.push({
      id:this.userId,
      msg: `${this.userName}: ${this.message}`,
      fecha: ''
    });
    this.message = "";    
  }

  messageTyping(): void {
    this.chatSvc.emit('typing','c'+this.projectId);    
  }

  salir():void{
    //this.chatSvc.desconectar(); || Esta para cuando cierran sesion
    this.chatSvc.emit('salir','c'+this.projectId);
    this.router.navigate(['Backlog/Proyecto/',this.projectId])
  }


}
