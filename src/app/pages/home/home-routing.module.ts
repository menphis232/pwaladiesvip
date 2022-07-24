import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteComponent } from '../favorite/favorite.component';
import { ShowComponent } from '../favorite/show/show.component';
import { AnuncioComponent } from './anuncio/anuncio.component';
import { VideoComponent } from './anuncio/video/video.component';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'config',
    loadChildren: () => import('../profile/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: "anuncio",
    component:AnuncioComponent
  },
  {
    path: "anuncio/video",
    component:VideoComponent
  },
  {
    path: "favorito",
    component:FavoriteComponent
  },
  {
    path: "favorito/show",
    component:ShowComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
