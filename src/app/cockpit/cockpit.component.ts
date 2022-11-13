import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, AfterContentInit } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { BehaviorSubject } from 'rxjs';
import { InstallService } from '../services/install.service';
import { TauriService } from '../services/tauri.service';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent implements OnInit {
  missingBinaries: string[] | null = null;
  // missingBinaries$: BehaviorSubject<string[] | null>;
  selectedForInstall: string[] = [];
  depsSastified: boolean = false;
  cloneDone = false;
  @ViewChild('selectedDeps', { static: false}) selectionList: MatSelectionList | undefined;
  
  constructor(private installer: InstallService, private tauri: TauriService) {
    // this.missingBinaries$ = this.installer.notInstalled$;
    this.installer.depsSastified$.subscribe(val => {
      this.depsSastified = val;
      console.log(val)
    })
    this.installer.notInstalled$.subscribe(binaries => {
      this.missingBinaries = binaries
    })
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }
  
  ngAfterContentInit() {
  }

  installDeps(): void {
    this.selectedForInstall.forEach(dep => {
      this.tauri.tryInstallBinary(dep).then(res => {
      })
    })
    this.reCheckDeps();
  }

  reCheckDeps() {
    this.installer.checkDeps();
    this.selectionList?.deselectAll();
    this.selectedForInstall = [];
  }
  
  setSelectedDeps(): void {
    let options: MatListOption[] = this.selectionList!.selectedOptions.selected;
    let selectedDeps: string[] = []
    options.forEach(option => {
      selectedDeps.push(option.value)
    })
    this.selectedForInstall = selectedDeps;
  }

  clone_repo() {
    this.installer.clone_repo_api();
  }

}
