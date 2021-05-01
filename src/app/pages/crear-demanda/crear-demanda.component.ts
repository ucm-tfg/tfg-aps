import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ROL_ENTIDAD, ROL_PROFESOR, ROL_ESTUDIANTE } from './../../../../server/models/rol.model';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { DemandaService } from 'src/app/services/demanda.service';
import { Demanda } from 'src/app/models/demanda.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

//HACER EN EL HTML UNA FUNCION FECHAS NO VALIDAS COMO LA DEL PERFIL,
@Component({
  selector: 'app-demanda-crear',
  templateUrl: './crear-demanda.component.html',
  styleUrls: ['./crear-demanda.component.scss']
})
export class crearDemandaComponent implements OnInit {

  public formSubmitted = false;
  public formSending = false;
  public Demanda_id: string = null;
  public areaServicio: any ;
  public necesidadSocial: any;
  public titulacionLocal: any;
  public Demanda: Demanda;
  public USUARIOS;
  public createDemandForm: FormGroup;
  public aux_area: string;
  public aux_area2: string;
  public aux_area3: string;
  public htmlStr: string;

  
//   constructor(public fb: FormBuilder, public usuarioService: UsuarioService, public fileUploadService: FileUploadService, public router: Router, private DemandaService: DemandaService, public Demanda: Demanda, public activatedRoute: ActivatedRoute) { 
//     if(this.usuarioService.usuario.esGestor) {
//       this.usuarioService.cargarUsuarios(0, 99999999, {terminoBusqueda: ''}).subscribe( ({total, filtradas, usuarios}) => {
//         this.USUARIOS = usuarios.filter( usuario => ['ROL_ENTIDAD', 'ROL_PROFESOR', 'ROL_GESTOR'].includes(usuario.rol));
//       });
//     }
//   }

constructor( public fb: FormBuilder, public usuarioService: UsuarioService, public fileUploadService: FileUploadService, public router: Router, public DemandaService: DemandaService, public activatedRoute: ActivatedRoute) {
  if(this.usuarioService.usuario.esGestor) {
    this.usuarioService.cargarUsuarios(0, 99999999, {terminoBusqueda: ''}).subscribe( ({total, filtradas, usuarios}) => {
      this.USUARIOS = usuarios.filter( usuario => ['ROL_ENTIDAD', 'ROL_PROFESOR', 'ROL_GESTOR'].includes(usuario.rol));
    });
  }
}
  
  async ngOnInit(){
    await this.cargarDemanda();
    await this.obtenerAreasServicio();
    await this.obtenerNecesidades();
    await this.obtenerTitulaciones();
    this.createDemandForm = this.fb.group({
      titulo: [this.Demanda.titulo || '', Validators.required],
      descripcion: [this.Demanda.descripcion || '', Validators.required],
      area_servicio: [this.Demanda.area_servicio || '', Validators.required],
      ciudad: [this.Demanda.ciudad || '', Validators.required],
      objetivo: [this.Demanda.objetivo || '', Validators.required],
      fechaDefinicionIni: [this.Demanda.periodoDefinicionIni || '', Validators.required],
      fechaDefinicionFin: [this.Demanda.periodoDefinicionFin || '', Validators.required],
      fechaEjecucionIni: [this.Demanda.periodoEjecucionIni || '', Validators.required],
      fechaEjecucionFin: [this.Demanda.periodoDefinicionFin || '', Validators.required],
      fechaFin: [this.Demanda.fechaFin || '', Validators.required],
      necesidad_social: [this.Demanda.necesidad_social || '', Validators.required],
      comunidadBeneficiaria: [this.Demanda.comunidadBeneficiaria || '', Validators.required],
      titulacion_local: [this.Demanda.titulacion_local || '', Validators.required],
      observaciones: this.Demanda.observacionesTemporales ,


    });
  }

  // public createDemandForm = this.fb.group({
  //   titulo: new FormControl('', 
  //     Validators.required),
  //   descripcion: new FormControl('', Validators.required),
  //   areaServicio: new FormControl('',
  //     Validators.required),
  //   ciudad: new FormControl('',
  //     Validators.required
  //   ),
  //   finalidad: new FormControl('', Validators.required),
  //   fechaDefinicionIni: new FormControl('', Validators.required),
  //   fechaDefinicionFin: new FormControl('', Validators.required),
  //   fechaEjecucionIni: new FormControl('', Validators.required),
  //   fechaEjecucionFin: new FormControl('', Validators.required),
  //   fechaFin: new FormControl('', Validators.required),
  //   necesidadSocial: new FormControl(''),
  //   comunidadBeneficiaria: new FormControl(''),
  //   titulacionLocal: new FormControl('')
  // }, {
  //   validators: [
  //   ]
  // });


  


  async  obtenerAreasServicio() {
     return this.DemandaService.obtenerAreasServicio()
        .subscribe( (resp: any) => {
          console.log(resp)
          this.areaServicio =resp.areasServicio
          console.log("Las areas de servicio son ", this.areaServicio);
          return this.areaServicio;
        });
  }

  async  obtenerNecesidades() {
    return this.DemandaService.obtenerNecesidades()
       .subscribe( (resp: any) => {
         console.log(resp)
         this.necesidadSocial =resp.necesidadSocial
         console.log("las necesidades sociales son ", this.necesidadSocial);
         return this.necesidadSocial;
       });
 }

 async  obtenerTitulaciones() {
  return this.DemandaService.obtenerTitulaciones()
     .subscribe( (resp: any) => {
       console.log(resp)
       this.titulacionLocal =resp.titulacionLocal
       console.log("Las titulaciones locales son ", this.titulacionLocal);
       return this.titulacionLocal;
     });
}

observableEnviarDemanda() {
  return this.DemandaService.crearDemanda(this.createDemandForm.value);
}

  get getTitulo() {
    return this.createDemandForm.get('titulo')
  }

  get getDescripcion() {
    return this.createDemandForm.get('descripcion')
  }
  get getPortada() {
    return this.createDemandForm.get('portada')
  }
  get getAreaServicio() {
    return this.createDemandForm.get('areaServicio')
  }
  get getCiudad() {
    return this.createDemandForm.get('ciudad')
  }
  get getObjetivo() {
    return this.createDemandForm.get('objetivo')
  }
  get getFechaDefinicionIni() {
    return this.createDemandForm.get('fechaDefinicionIni')
  }
  get getFechaDefinicionFin() {
    return this.createDemandForm.get('fechaDefinicionFin')
  }
  get getFechaEjecucionIni() {
    return this.createDemandForm.get('fechaEjecucionIni')
  }
  get getFechaEjecucionFin() {
    return this.createDemandForm.get('fechaEjecucionFin')
  }
  get getFechaFin() {
    return this.createDemandForm.get('fechaFin')
  }
  get getObservacionTemporal() {
    return this.createDemandForm.get('observacionTemporal')
  }
  
  get getNecesidadSocial() {
    return this.createDemandForm.get('necesidadSocial')
  }
  get getComunidadBeneficiaria(){
    return this.createDemandForm.get('comunidadBeneficiaria')
  }
  get getTitulacionLocal(){
    return this.createDemandForm.get('titulacionLocal')
  }

  obtenerIdAreaServicio(){
    var area_seleccionada = this.createDemandForm.get('area_servicio').value;
    let pos_area = 0;
    while(pos_area < this.areaServicio.length && this.areaServicio[pos_area].nombre != area_seleccionada){
      pos_area++;
    }
    return pos_area;
  }

  obtenerIdTitulaciones(){
    var area_seleccionada = this.createDemandForm.get('titulacion_local').value;
    let pos_area = 0;
    while(pos_area < this.titulacionLocal.length && this.titulacionLocal[pos_area].nombre != area_seleccionada){
      pos_area++;
    }
    return pos_area;
  }

  obtenerIdNecesidades(){
    var area_seleccionada = this.createDemandForm.get('necesidad_social').value;
    let pos_area = 0;
    while(pos_area < this.necesidadSocial.length && this.necesidadSocial[pos_area].nombre != area_seleccionada){
      pos_area++;
    }
    return pos_area;
  }

  create(): void {
    this.formSubmitted = true;

    if (this.createDemandForm.invalid) {
      return;
    }
    this.formSending=true;
    let encontrado = this.obtenerIdAreaServicio();
    if(encontrado >= this.areaServicio.length){
      let msg = [];
      msg.push('El area de servicio seleccionado no es correcto');
      Swal.fire('Error', msg.join('<br>'), 'error');
      this.formSubmitted = false;
      this.formSending = false;
    }
    this.aux_area = this.createDemandForm.get('area_servicio').value;
    console.log("La posicion del area de servicio es ",encontrado)
    console.log("Y su valor es ", this.aux_area);
    this.createDemandForm.get('area_servicio').setValue(this.areaServicio[encontrado].id);

    let encontrado2 = this.obtenerIdTitulaciones();
    if(encontrado2 >= this.titulacionLocal.length){
      let msg = [];
      msg.push('La titulacion seleccionada no es correcta');
      Swal.fire('Error', msg.join('<br>'), 'error');
      this.formSubmitted = false;
      this.formSending = false;
    }
    this.aux_area2 = this.createDemandForm.get('titulacion_local').value;
    console.log("La posicion de la titulacion es ",encontrado)
    console.log("Y su valor es ", this.aux_area2);
    this.createDemandForm.get('titulacion_local').setValue(this.titulacionLocal[encontrado].id);

    let encontrado3 = this.obtenerIdNecesidades();
    if(encontrado3 >= this.necesidadSocial.length){
      let msg = [];
      msg.push('La necesidad seleccionada no es correcta');
      Swal.fire('Error', msg.join('<br>'), 'error');
      this.formSubmitted = false;
      this.formSending = false;
    }
    this.aux_area3 = this.createDemandForm.get('necesidad_social').value;
    console.log("La posicion de la necesidad es ",encontrado)
    console.log("Y su valor es ", this.aux_area3);
    this.createDemandForm.get('necesidad_social').setValue(this.necesidadSocial[encontrado].id);
    this.observableEnviarDemanda().subscribe(resp =>{
      this. Demanda_id
        ? Swal.fire('Ok', 'Demanda actualizada correctamente', 'success')
        : Swal.fire('Ok', 'Demanda creada correctamente', 'success');

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/']);
      this.formSubmitted = false;
      this.formSending = false;
    }, err => {
      console.log(err);
      let msg = [];
      if(err.error.errors){
        Object.values(err.error.errors).forEach(error_entry => {
          msg.push(error_entry['msg']);
        });
      } else {
        msg.push(err.error.msg);
      }
      Swal.fire('Error', msg.join('<br>'), 'error');
      this.formSubmitted=false;
      this.formSending= false;
    });
  } 
   noAreaMatch() {
    let accept=true;
          for (let a of this.areaServicio) {
            if (a.nombre === this.createDemandForm.get('area_servicio').value || this.createDemandForm.get('area_servicio').value === '')
              accept = false;
          }
          return accept;

  } 
  noNecesidadMatch() {
    let accept=true;
          for (let n of this.necesidadSocial) {
            if (n.nombre === this.createDemandForm.get('necesidad_social').value || this.createDemandForm.get('necesidad_social').value === '')
              accept = false;
          }
          return accept;

  } 
  noTitulacionMatch() {
    let accept=true;
          for (let t of this.titulacionLocal) {
            if (t.nombre === this.createDemandForm.get('titulacion_local').value || this.createDemandForm.get('titulacion_local').value === '')
              accept = false;
          }
          return accept;

  } 

  campoNoValido(campo): String {

    let invalido = this.createDemandForm.get(campo) && this.createDemandForm.get(campo).invalid;

    if(invalido) {
      // switch (campo) {
      //   case 'terminos_aceptados':
      //     return 'Es obligatorio aceptar las condiciones de uso';
      //     break;

      //   default:
          return `El campo ${ campo } es obligatorio`;
      //     break;
      // }
    }
    
    return '';
  }
  validarFechas(fechaDefinicionIni: Date, fechaDefinicionFin: Date, fechaEjecucionIni: Date, fechaEjecucionFin: Date, fechaFin: Date, customError = 'mismatch'){
    return (FormGroup: FormGroup) =>{
      if(fechaDefinicionIni >= fechaDefinicionFin){
        return { [customError]: true };
      }
      else if(fechaEjecucionIni >= fechaEjecucionFin){
        return { [customError]: true };
      }
      else if(fechaDefinicionIni >= fechaEjecucionIni){
        return { [customError]: true };
      }
    }
  }


  async cargarDemanda() {
    this.Demanda = new Demanda('', '', '', '', '', '', [],'','','','','','',[],[],null, '','','');
  }
   subirFichero( file: File ) {
    if( !file ) { return; }

    this.fileUploadService
        .subirFichero(file, 'archivos', 'demanda', this.Demanda.id)
        .then( resp => {
          const {ok, msg, upload_id} = resp;
          if(ok) {
            this.cargarDemanda();
            Swal.fire('Ok', 'Fichero subido correctamente', 'success');
          } else {
            Swal.fire('Error', msg, 'error');
          }
        });
  }
}
