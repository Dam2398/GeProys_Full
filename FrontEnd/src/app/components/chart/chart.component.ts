import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartType, ChartOptions, ChartColor } from "chart.js";
import * as moment from 'moment';
import { Color, Label ,PluginServiceGlobalRegistrationAndOptions} from "ng2-charts";
import { environment } from './../../../environments/environment';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {

  //Para el pdf
  @ViewChild('content',{static: false}) el!: ElementRef;

  urlTasks =  environment.API_URL;
  backlog: any;
  sprint:any;
  sprintNombre:any;

  com1:boolean= false;
  com2:boolean= false;
  com3:boolean= false;

  hoy:any;

  barras: boolean =true;
  pastel:boolean = false;
  pendiente: boolean = false;
  ActBar:any = 'Ocultar';
  ActPas:any = 'Mostrar';
  ActPen:any = 'Mostrar';
  fechaINicio:any;
  fechaFin:any;
  fechaInSa:any;
  fechaFiSa:any;

  puntos:number[]=[];
  puntosCorrectos:number[] = [];

  projectId: any;
  sprintId:any;
  localToken = localStorage.getItem('token')
  idUser = localStorage.getItem('idUser')

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales:{
      yAxes:[{
        display:true,
        scaleLabel:{
          display:true,
          labelString:'Tareas',

        },
        ticks:{
          beginAtZero:true,
        }
      }]
    }

  };
  
  public lineChartOptions: ChartOptions = {
    elements:{
      line:{
        fill:false//eliminar background
      }
    },
    responsive: true,
    scales:{
      yAxes:[{
        display:true,
        scaleLabel:{
          display:true,
          labelString:'Tareas'
        },
        ticks:{
          beginAtZero:true
        }
      }]
    },
    
  };  

  public barChartLabels: Label[] = ['Estado de las tareas'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [10], label: 'No Hecho' , backgroundColor:'#ff6961'},
    { data: [10], label: 'En Progreso' },
    { data: [10], label: 'Hecho' , backgroundColor:'rgb(120, 222, 120)', borderColor:'rgb(120, 222, 120)', hoverBackgroundColor:'rgb(120, 222, 120)'}
  ];

  public lineChartData: ChartDataSets[] = [
    { data: [10], label: 'Tareas restantes' },
    { data: [10], label: 'Tereas restantes ideales'},
  ];

  public lineChartLabels: Label[] = [];

 
  public lineChartColors: Color[] = [
    
    {
      borderColor:'red',
      backgroundColor: 'red'
    },
    {
      borderColor: 'black',
      backgroundColor:'#FFFFFF'
    }
  ];
  public lineChartLegend = true;
  public lineChartType : ChartType  = 'line';
  public lineChartPlugins = [];
  

  constructor(private router: Router,
              private httpClient : HttpClient,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectId = params['projectId'];//id del proyecto
      this.sprintId =params['sprintId'];
    });

    let headers = new HttpHeaders().set('auth',`${this.localToken}`);
    let promise = this.httpClient.get(this.urlTasks+ `tareas/?sprintId=${this.sprintId}&userId=${this.idUser}&projectId=${this.projectId}`,{headers}).toPromise();
    promise.then((data)=>{
      this.backlog =data;
      //console.log(this.backlog)
      //console.log(this.backlog[0]['status'])
      //console.log(this.backlog.length)
      this.separar(this.backlog)
      
      let sprintpro = this.httpClient.get(this.urlTasks+`sprints/byid/${this.sprintId}?&userId=${this.idUser}&projectId=${this.projectId}`,{headers}).toPromise();
      sprintpro.then((data)=>{
        this.sprint = data
        this.sprintNombre = this.sprint['name']
        this.linea(this.sprint,this.backlog)
      }).catch((error)=>{
        console.log(error)
      })
    }).catch((error)=>{
      console.log(error);
    })

    
  }

  linea(sprint:any, tareas:any){
    this.fechaINicio = sprint['fechaInicio']
    this.fechaInSa = String(this.fechaINicio).split('-').reverse().join('-')
    this.fechaFin = sprint['fechaFin']; 
    this.fechaFiSa = String(this.fechaFin).split('-').reverse().join('-')
    let TiempoSprint = Math.abs(moment(this.fechaINicio).diff(moment(this.fechaFin),'days'))
    this.puntos[0] = tareas.length
    console.log(this.fechaINicio,this.fechaFin)

    
    let hoy2 =new Date()
    console.log(hoy2.getDate()+'/'+(hoy2.getMonth()+1)+'/'+hoy2.getFullYear())
    this.hoy= hoy2.getDate()+'/'+(hoy2.getMonth()+1)+'/'+hoy2.getFullYear()

    let TimepoHoy = Math.abs(moment(this.fechaINicio).diff(moment(hoy2),'days'))
    //console.log(tareas.length)
    
    //let up = (String(tareas[0]['fechaUpdate']).split('T'))[0]

    //console.log(Math.abs(moment(this.fechaINicio).diff(moment(up),'days')))

    
    for (let j = 0; j < TiempoSprint; j++) {
      this.lineChartLabels[j] = `Dia ${j+1}`;
      if( j <= TimepoHoy){
        for (let i = 0; i < tareas.length; i++) {
          if(tareas[i]['status'] == 'Done'){
            let fechaS = (String(tareas[i]['fechaUpdate']).split('T'))[0]
            let fechaN = Math.abs(moment(this.fechaINicio).diff(moment(fechaS),'days'))//la diferencia de dias con el inicio del sprint
            if (fechaN == j) {
              this.puntos[j] = this.puntos[j]-1;
            }
          }
        }
        this.puntos[j+1]= this.puntos[j]
      }
      this.puntosCorrectos[j] = tareas.length - (tareas.length/(TiempoSprint-1))*(j)
    }
    this.lineChartData[0].data = this.puntos
    this.lineChartData[1].data = this.puntosCorrectos
    //console.log(this.puntos)
  }

  separar(tareas:any){
    let contNotDone =0;
    let contInProgress=0;
    let contDone=0;
    for (let i = 0; i < tareas.length; i++) {
      if (tareas[i]['status']=='NotDone') {
        contNotDone=contNotDone+1;
        this.barChartData[0].data = []
      }if (tareas[i]['status']=='InProgress') {
        contInProgress = contInProgress+1;
      } if(tareas[i]['status']=='Done') {//DONE
        contDone = contDone+1;
      }
    }
   // console.log(contDone,contInProgress,contNotDone)//imprime las tareas por sus estado
    this.barChartData[0].data = [contNotDone];
    this.barChartData[1].data = [contInProgress];
    this.barChartData[2].data = [contDone];

    this.pieChartData[0]=contNotDone;
    this.pieChartData[1]= contDone;
    this.pieChartData[2]= contInProgress;
  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    //console.log(event, active);
  }

  public randomize(): void {//Cambio de graficas
    if (!this.barras) {
      this.ActBar = 'Ocultar' 
    }else{
      this.ActBar ='Mostrar'
    }

    this.barras = !this.barras;

  }
  ranpastel(){
    if (!this.pastel) {
      this.ActPas = 'Ocultar' 
    }else{
      this.ActPas ='Mostrar'
    }
    this.pastel = !this.pastel
  }
  ranlineal(){
    if (!this.pendiente) {
      this.ActPen = 'Ocultar' 
    }else{
      this.ActPen ='Mostrar'
    }
    this.pendiente = !this.pendiente
  }
//-----------------------------------------------------PIE
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value:any, ctx:any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };

  public pieChartLabels: Label[] = [['No Hecho'], ['Hecho'], ['En Progreso']];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins:PluginServiceGlobalRegistrationAndOptions[] = [{
    
  }];

  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  makePDF(){

    const DATA :any = document.getElementById('content');
    const data2:any = document.querySelector('#content')
    //console.log(DATA.offsetHeight)
    DATA.style.height = DATA.scrollHeight +'px';

/*     const div =document.createElement('div');
    div.textContent = `${this.sprintNombre}`;
    
    const data2:any = document.querySelector('#content')

    data2.insertAdjacentElement('afterbegin',div) */
    
    let pdf = new jsPDF('p','pt','a4');
    let options = {
      background: 'white',
      height: DATA.offsetHeight,
      with: DATA.offsetWidth
    };
    html2canvas(DATA,options).then((canvas)=>{
      const img = canvas.toDataURL('image/PNG');

      //Add image canvas to pdf
      const bufferX = 15;
      let bufferY = 15;
      const imgProps = (pdf as any).getImageProperties(img);
      const pdfWidth = pdf.internal.pageSize.getWidth()-2 * bufferX;
      const pageHeight = pdf.internal.pageSize.getHeight();//size page
      let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      let heightLeft  = pdfHeight
      //console.log(pageHeight,pdfHeight)
      pdf.addImage(img, 'PNG',bufferX,bufferY,pdfWidth,pdfHeight,undefined, 'FAST');
      heightLeft -= pageHeight
      
      //pdf.addPage();
      while (heightLeft>=0) {
        
        bufferY += heightLeft-pdfHeight
        pdf.addPage();
        pdf.addImage(img, 'PNG',bufferX,bufferY,pdfWidth,pdfHeight,undefined, 'FAST');
        heightLeft-=pageHeight
 
      }
      return pdf;
    }).then((docResult)=>{
      docResult.save(`${this.hoy}_sprint_${this.sprintNombre}.pdf`)
      
      docResult.output('dataurlnewwindow')
    })
 

  }
 

}
