import { Component, ElementRef, ViewChild } from '@angular/core';
import { Tarea } from 'src/app/models/tarea';
import { ApiTareasService } from 'src/app/services/api-tareas.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import html2canvas from 'html2canvas';



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
  @ViewChild('errorModal') errorModal?: ElementRef;
  
  constructor(private apiTareasService: ApiTareasService, private ruta: Router, private datePipe: DatePipe){}

  ngOnInit(){
    this.cargarTareas();
  }

  cargarTareas(){
    this.apiTareasService.getTareas().subscribe({
      next:res=>{
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
  

  obtenerTareasFinalizadas(): Tarea[] {
    return this.tareas.filter(tarea => tarea.estado === 'Finalizado');
  }

  obtenerTareasEnProceso(): Tarea[] {
    return this.tareas.filter(tarea => tarea.estado === 'En proceso');
  }

  obtenerTareasCanceladas(): Tarea[] {
    return this.tareas.filter(tarea => tarea.estado === 'Cancelado');
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
    
  formatearFecha(fecha: Date):string{   
    let fechaFormateada = this.datePipe.transform(fecha, "dd/MM/yy")
    if(!fechaFormateada){
      fechaFormateada = "";
    }
    return fechaFormateada;
  }

  capturarYCompartir(tareaId: string): void {
    const tareaElement = document.getElementById(`tarea-${tareaId}`);
    if (tareaElement) {
      html2canvas(tareaElement).then(canvas => {
        // Convertir el canvas en imagen
        const imagenBase64 = canvas.toDataURL('image/png');

        // Crear un enlace temporal para descargar la imagen
        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = imagenBase64;
        enlaceDescarga.download = `Tarea-${tareaId}.png`;
        enlaceDescarga.click();
      });
    }
  }

  cambiarColorEstado(estado: string){
    switch(estado) {
      case 'Finalizado':
        return 'text-success';
      case 'En proceso':
        return 'text-warning';
      case 'Cancelado':
        return 'text-danger';
      default:
        return '';
    }
  }


  /* editarTarea() {
    this.ruta.navigate(['/editar', this.tareas._id]);
  } */
  editarTarea(tarea: Tarea) {
    console.log("Editar tarea:", tarea);
    this.ruta.navigate(['/editar', tarea._id]);
  }

}
