import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from "rxjs";//OJO

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket: any; 
  url = 'ws://localhost:3001';

  constructor() {
    this.socket = io(this.url, { secure: true, reconnection: true, rejectUnauthorized: false ,transports: ['websocket'] });
   }
  
  listen(eventname: string) : Observable<any> {
    return new Observable((subscriber) => {
        this.socket.on(eventname, (data: any) => {
          subscriber.next(data);
        });
    });
  }

  desconectar():void{
    this.socket.disconnect();
  }
  conectar():void{
    this.socket.connect();
  }

  emit(eventname: string, data: any) {
   this.socket.emit(eventname, data);
  }

  emit2(eventname: string, room:any, user:any){
    this.socket.emit(eventname, room,user);
  }

  emit3(eventname:string, room:any, msg:any, id:any){
    this.socket.emit(eventname,room,msg,id);
  }

}
