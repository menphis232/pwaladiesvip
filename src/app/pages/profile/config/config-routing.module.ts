import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnuncioComponent } from '../anuncio/anuncio.component';
import { CuentaAccesoComponent } from '../cuenta-acceso/cuenta-acceso.component';
import { HelpComponent } from '../help/help.component';
import { InformacionPersonalComponent } from '../informacion-personal/informacion-personal.component';
import { NegociosComponent } from '../negocios/negocios.component';
import { PacksAnunciosComponent } from '../packs-anuncios/packs-anuncios.component';
import { PagoComponent } from '../pago/pago.component';
import { PlanesComponent } from '../planes/planes.component';
import { TerminosCondicionesComponent } from '../terminos-condiciones/terminos-condiciones.component';

import { ConfigPage } from './config.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigPage
  },
  {
    path: 'anuncio',
    component: AnuncioComponent
  },
  {
    path: 'packs_anuncios',
    component: PacksAnunciosComponent
  },
  {
    path: 'info_perso',
    component: InformacionPersonalComponent
  },
  {
    path: 'negocios',
    component: NegociosComponent
  },
  {
    path: 'cuenta-acceso',
    component: CuentaAccesoComponent
  },
  {
    path: 'pago',
    component: PagoComponent
  },
  {
    path: 'planes',
    component: PlanesComponent
  },
  {
    path: 'help',
    component: HelpComponent
  }
  ,
  {
    path: 'terminos-condiciones',
    component: TerminosCondicionesComponent
  }
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigPageRoutingModule {}
