import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignInFormComponent } from './signIn-form/signIn-form.component';
import { SignUpFormComponent } from './signUp-form/signUp-form.component';
import { AuthGuard } from '../../guards/auth.guard';


const routes: Routes = [
    { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
    { path: 'sign-in', component: SignInFormComponent },
    { path: 'sign-up', component: SignUpFormComponent },
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserRoutesModule { }
