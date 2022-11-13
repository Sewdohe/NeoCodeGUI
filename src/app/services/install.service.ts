import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TauriService } from './tauri.service';
import { Command, SpawnOptions } from '@tauri-apps/api/shell'
import { BaseDirectory } from '@tauri-apps/api/fs';

@Injectable({
  providedIn: 'root'
})
export class InstallService {
  dependencies = ['git', 'rg', 'lazygit', 'nvim', 'cmatrix', 'neofetch', 'cowsay']
  public notInstalled$ = new BehaviorSubject<string[] | null>(null)
  notInstalled: string[] = [];
  public depsSastified$ = new BehaviorSubject<boolean>(false);

  constructor(private tauri: TauriService) {
    this.checkDeps();
  }

  clone_repo() {
    this.tauri.clone_repo()
  }

  async clone_repo_api() {
    console.log('attempting clone command')
    let command = new Command('git', ['clone', '--progress', 'https://github.com/Sewdohe/NeoCode', 'dirDir']);
    // command.execute();
    command.on('close', data => {
      console.log(`command finished with code ${data.code} and signal ${data.signal}`)
    });
    command.on('error', error => console.error(`command error: "${error}"`));
    command.stdout.on('data', line => console.log(`command stdout: "${line}"`));
    command.stderr.on('data', line => console.log(`command stderr: "${line}"`));

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
