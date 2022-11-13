import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { InstallService } from "./services/install.service";
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: "app-root",
  templateUrl: 'app.component.html',
  styles: [
    `
      .logo.angular:hover {
        filter: drop-shadow(0 0 2em #e32727);
      }
    `,
  ],
  standalone: false,
})
export class AppComponent {

  constructor() {
  }
  
  ngOnInit() {
    
  }

}
