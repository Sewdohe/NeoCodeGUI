import { Injectable } from '@angular/core';
import { BaseDirectory, createDir, writeFile, exists, renameFile } from "@tauri-apps/api/fs";
import { invoke } from '@tauri-apps/api/tauri'
import { BehaviorSubject } from 'rxjs';
import { configDir } from '@tauri-apps/api/path';

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

  public async backup() {
    const configDirPath = await configDir();
    return invoke('backup_old_config', {configPath: configDirPath})
  }

  public async packerInstall() {
    return invoke('run_packer_install')
  }

  public async tryInstallBinary(binaryName: string): Promise<boolean> {
    return invoke<boolean>('try_install_binary', { binaryName })
  }
}
