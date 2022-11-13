import { Injectable } from '@angular/core';
import { BaseDirectory, createDir, writeFile } from "@tauri-apps/api/fs";
import { invoke } from '@tauri-apps/api/tauri'
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TauriService {
  dataDir = BaseDirectory.Config;
  currentOS = new BehaviorSubject('');

  createDataFolder = async () => {
    try {
      await createDir("NeoCode", {
        dir: this.dataDir,
        recursive: true,
      })
    } catch (e) {
      console.error(e)
    }
  }

  constructor() {
    console.warn('tauri service constructed')
    invoke<string>('check_os').then(res => {
      this.currentOS.next(res)
    })
  }

  public async checkForBinary(binaryName: string): Promise<boolean> {
    return invoke<boolean>('check_installed', { binaryName })
  }

  public async clone_repo() {
    return invoke('clone_repo')
  }

  public async tryInstallBinary(binaryName: string): Promise<boolean> {
    return invoke<boolean>('try_install_binary', { binaryName })
  }
}
