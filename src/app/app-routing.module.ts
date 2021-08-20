import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { UserlistsComponent } from './userlists/userlists.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user/home', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'user/lists', component: UserlistsComponent, canActivate: [AuthenticationGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
