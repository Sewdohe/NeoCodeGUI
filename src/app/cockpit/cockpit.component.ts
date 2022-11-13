import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Command } from '@tauri-apps/api/shell';
import { BehaviorSubject } from 'rxjs';
import { InstallService } from '../services/install.service';
import { TauriService } from '../services/tauri.service';
import { configDir } from '@tauri-apps/api/path';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.css']
})
export class CockpitComponent {
  missingBinaries: string[] | null = null;
  selectedForInstall: string[] = [];
  depsSastified: boolean = false;
  cloneDone = false;
  cloneStarted = false;
  clonePercent = 0;
  clonePercent$ = new BehaviorSubject(0);
  @ViewChild('selectedDeps', { static: false}) selectionList: MatSelectionList | undefined;
  
  constructor(
    private installer: InstallService,
    private tauri: TauriService,
    private cdr: ChangeDetectorRef) {
    // this.missingBinaries$ = this.installer.notInstalled$;
    this.installer.depsSastified$.subscribe(val => {
      this.depsSastified = val;
      console.log(val)
    })
    this.installer.notInstalled$.subscribe(binaries => {
      this.missingBinaries = binaries
    })
  }

  async clone_repo_api() {
    this.installer.performBackup();
    const configDirPath = await configDir();
    console.log('attempting clone command')
    let command = new Command('git', [
    'clone', 
    '--progress', 
    'https://github.com/Sewdohe/NeoCode', 
    'nvim'
  ], {cwd: configDirPath}); // NOTE: can pass config obj with cwd on it here 
    // command.execute();
    command.on('close', data => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`)
      this.cloneDone = true;
      this.cdr.detectChanges();
    });
    command.stderr.on('data', (line: string) => {
      console.log(line)
      const regex: RegExp = /[0-9]{1,3}%/g;
      let regexResult: RegExpMatchArray | null = line.match(regex)
      let percentString = regexResult![0].valueOf();
      let percentNumber = 0;
      if(percentString) {
        percentNumber = parseInt(percentString.replace("%", ""))
        console.log(percentNumber)
        this.clonePercent = percentNumber
        this.cdr.detectChanges();
      }
    });

    const child = await command.spawn()
  }
  
  ngAfterContentInit() {
    this.cdr.detectChanges();
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

  packerInstall() {
    this.tauri.packerInstall();
  }

  backup() {
    this.tauri.backup();
  }

  clone_repo() {
    this.installer.clone_repo_api();
  }

}
