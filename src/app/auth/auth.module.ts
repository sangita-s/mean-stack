import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthRoutingmodule } from "./auth-routing.modul";

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
    ],
    imports: [
        AngularMaterialModule,
        CommonModule,
        FormsModule,
        AuthRoutingmodule,
    ]
})
export class AuthModule{}