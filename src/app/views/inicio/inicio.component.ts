import { Component, ElementRef, ViewChild } from '@angular/core';
import { Tarea } from 'src/app/models/tarea';
import { ApiTareasService } from 'src/app/services/api-tareas.service';
import { AuthenticateService } from 'src/app/services/cognito.service';
import { Router } from "@angular/router";
import { ApiGatewayService } from 'src/app/services/api.gateway.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  tareas: Tarea[]=[];
  tareasTotal: Tarea[]=[];
  cargando: Boolean = true;
  error: Boolean = false;
  user: any;
  group: string = "TaskFlowTeamBack";
  @ViewChild('errorModal') errorModal?: ElementRef;
  
  constructor(private apiTareasService: ApiTareasService, private authService: AuthenticateService, private router: Router, private apiGatewayService: ApiGatewayService){}

  ngOnInit(){
    if(!this.authService.isAuthenticated()){
      this.router.navigate(["/login"]);
    }else{
      //this.cargarTareas();
      this.user = localStorage.getItem("user");
      this.apiGatewayService.getUser(this.user).subscribe(
        data => console.log('User data: ', data),
        error => console.log('Error: ', error)
      );
      this.loadTasks();
    }
  }

  cargarTareas(){
    this.apiTareasService.getTareas().subscribe({next:res=>{
      this.tareas = res;
      this.tareasTotal = res;
      this.cargando = false;
    },
    error: err=>{
      console.log("Error al obtener tareas: " + err.message);
      this.error = true;
      this.cargando = false;
    }});
  }

  loadTasks(){
    this.apiGatewayService.getTask(this.group).subscribe(
      data => {
        var dataJson = JSON.parse(data.body);
        const tasks = dataJson.Items;

        for(var task of tasks){
          var tareaAux: Tarea = {
            _id: task.taskId,
            titulo: task.tittle,
            descripcion: task.description,
            asignado: task.assignedUserId,
            fecha_fin: new Date(task.endAt),
            estado: task.status
          }
          this.tareas.push(tareaAux);
        }
        this.cargando = false;
      },
      error => {
        console.log("Error al obtener tareas: " + error.message);
        this.error = true;
        this.cargando = false;
      }
    )
  }

  buscarTarea(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      const buscarAsig = event.target.value.toLowerCase();
      if (buscarAsig) {
        this.tareas = this.tareas.filter(tarea => tarea.asignado.toLowerCase().includes(buscarAsig));
      } else {
        this.tareas = this.tareasTotal;
      }
    }
  }

}
