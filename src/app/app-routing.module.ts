import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CocinaComponent } from './pages/cocina/cocina.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { IndexAdminComponent } from './components/administrador/index/index.component';
import { IndexCajeroComponent } from './components/cajero/index/index.component';
import { DeliveryComponent } from './pages/delivery/delivery.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { HomeComponent } from './pages/home/home.component';
import { PaginaPerfilComponent } from './pages/pagina-perfil/pagina-perfil.component';
import { FacturapdfComponent } from './components/facturapdf/facturapdf.component';

//import Guards
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path : '', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent, canActivate:[AuthGuard]},
  { path: 'delivery', component: DeliveryComponent, canActivate:[AuthGuard]},
  { path: 'carrito', component: CarritoComponent, canActivate:[AuthGuard]},
  { path: 'usuario', component: PaginaPerfilComponent, canActivate:[AuthGuard]},
  { path: 'cocina', component: CocinaComponent, canActivate:[AuthGuard] },
  { path: 'administrador', component: IndexAdminComponent, canActivate:[AuthGuard]},
  { path: 'cajero', component: IndexCajeroComponent, canActivate:[AuthGuard]},
  { path: 'factura/:id', component: FacturapdfComponent, canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
