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
  @ViewChild('errorModal') errorModal?: ElementRef;
  
  constructor(private apiTareasService: ApiTareasService, private authService: AuthenticateService, private router: Router, private apiGatewayService: ApiGatewayService){}

  ngOnInit(){
    if(!this.authService.isAuthenticated()){
      this.router.navigate(["/login"]);
    }else{
      this.cargarTareas();
      this.user = localStorage.getItem("user");
      this.apiGatewayService.getUser(this.user).subscribe(
        data => console.log('User data: ', data),
        error => console.log('Error: ', error)
      );
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
