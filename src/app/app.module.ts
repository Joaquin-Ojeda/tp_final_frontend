import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { EliminarTareaComponent } from './components/eliminarTareas/eliminar-tarea/eliminar-tarea.component';


import { TareaCardComponent } from './components/tarea-card/tarea-card.component';
import { DatePipe } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './views/inicio/inicio.component';
import { CrearComponent } from './components/crear/crear.component';
import { EditarComponent } from './components/editar/editar.component';
@NgModule({
  declarations: [
    AppComponent,
    EliminarTareaComponent,
    TareaCardComponent,
    CrearComponent,
    TareaCardComponent,
    TareaCardComponent,
    InicioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientModule,
    EditarComponent
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
