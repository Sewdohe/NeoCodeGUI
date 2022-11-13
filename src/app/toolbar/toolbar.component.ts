import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { TauriService } from '../services/tauri.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  currentOS: BehaviorSubject<string>;
  osIconString: string | null = null;

  constructor(private tauri: TauriService) {
    this.currentOS = this.tauri.currentOS
    this.currentOS.subscribe(os => {
      switch(os) {
        case "Linux":
          this.osIconString = "fa-linux"
        break;
        case "MacOS":
          this.osIconString = "fa-apple"
        break;
        case "Windows":
          this.osIconString = "fa-windows"
        break;
      }
    })

  }

}
