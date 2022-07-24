import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ConfigPageRoutingModule } from './config-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ConfigPage } from './config.page';
import { AnuncioComponent } from '../anuncio/anuncio.component';
import { PacksAnunciosComponent } from '../packs-anuncios/packs-anuncios.component';
import { InformacionPersonalComponent } from '../informacion-personal/informacion-personal.component';
import { NegociosComponent } from '../negocios/negocios.component';
import { CuentaAccesoComponent } from '../cuenta-acceso/cuenta-acceso.component';
import { PagoComponent } from '../pago/pago.component';
import { HelpComponent } from '../help/help.component';
import { PlanesComponent } from '../planes/planes.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigPageRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    ConfigPage,
    AnuncioComponent,
    PacksAnunciosComponent,
    InformacionPersonalComponent,
    NegociosComponent,
    CuentaAccesoComponent,
    PagoComponent,
    HelpComponent,
    PlanesComponent
  ],
})
export class ConfigPageModule {}
