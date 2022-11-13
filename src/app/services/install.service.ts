import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TauriService } from './tauri.service';
import { Command, SpawnOptions } from '@tauri-apps/api/shell'
import { BaseDirectory, Dir } from '@tauri-apps/api/fs';
import { MatLine } from '@angular/material/core';

@Injectable({
  providedIn: 'root'
})
export class InstallService {
  dependencies = ['git', 'rg', 'lazygit', 'nvim', 'cmatrix', 'neofetch', 'cowsay', 'neovide']
  public notInstalled$ = new BehaviorSubject<string[] | null>(null)
  notInstalled: string[] = [];
  public depsSastified$ = new BehaviorSubject<boolean>(false);
  clonePercent = new BehaviorSubject(0);

  constructor(private tauri: TauriService) {
    this.checkDeps();
  }

  async clone_repo_api() {
    console.log('attempting clone command')
    let command = new Command('git', [
    'clone', 
    '--progress', 
    'https://github.com/Sewdohe/NeoCode', 
    'nvim'
  ]); // NOTE: can pass config obj with cwd on it here 
    // command.execute();
    command.on('close', data => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`)
    });
    command.stderr.on('data', (line: string) => {
      console.log(line)
      const regex: RegExp = /[0-9]{1,3}%/g;
      let regexResult: RegExpMatchArray | null = line.match(regex)
      let percentString = regexResult![0].valueOf();
      let percentNumber = 0;
      if(percentString) {
        percentNumber = parseInt(percentString.replace("%", ""))
        this.clonePercent.next(percentNumber);
      }
    });
    // command.on('error', error => console.error(`command error: "${error}"`));
    // command.stderr.on('data', line => console.log(`command stderr: "${line}"`));

    const child = await command.spawn()
  }

  async getDepsList() {
    this.notInstalled = [];
    this.dependencies.forEach(async (dep) => {
      let res = await this.tauri.checkForBinary(dep);
      if (res == false) {
        this.notInstalled.push(dep);
      }
    })
    console.log('got deps')
    console.log(this.notInstalled)
  }

  async performBackup() {
    this.tauri.backup();
  }

  checkDeps() {

    this.getDepsList().then(_res => {
      setTimeout(() => { // <- I'm fucking ashamed of this ;__; but it made stuff work
        if (this.notInstalled.length == 0) {
          this.depsSastified$.next(true);
        } else {
          this.depsSastified$.next(false);
        }

        this.notInstalled$.next(this.notInstalled)
      }, 1000);
    })
  }

}
