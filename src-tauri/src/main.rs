#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::path::PathBuf;
use std::process::Command;
use std::{env, fs};

use os_info::Type;

pub fn get_home_dir() -> PathBuf {
    let os = env::consts::OS;
    let mut config_folder_path = PathBuf::from("");

    if os == "windows" {
        // set URL for windows config
        match env::var("USERPROFILE") {
            Ok(val) => {
                config_folder_path.push(val);
            }
            Err(e) => println!("couldn't interpret {}: {}", "USERPROFILE", e),
        }
        return config_folder_path;
    } else if os == "linux" {
        // set URL for unix config
        match env::var("HOME") {
            Ok(val) => {
                config_folder_path.push(val);
            }
            Err(e) => println!("couldn't interpret {}: {}", "USERPROFILE", e),
        }
        return config_folder_path;
    } else if os == "macos" {
        // set URL for unix config
        match env::var("HOME") {
            Ok(val) => {
                config_folder_path.push(val);
            }
            Err(e) => println!("couldn't interpret {}: {}", "USERPROFILE", e),
        }
        return config_folder_path;
    } else {
        println!("Something is wrong!");
        // this is a terrible way to handle errors
        // TODO:
        return PathBuf::from("");
    }
}

pub fn determine_config_path() -> PathBuf {
    let os = env::consts::OS;
    let mut config_path = get_home_dir();
    if os == "windows" {
        config_path.push("AppData");
        config_path.push("Local");
        return config_path;
    } else if os == "linux" {
        // set URL for unix config
        config_path.push(".config");
        return config_path;
    } else if os == "macos" {
        // set URL for unix config
        config_path.push(".config");
        return config_path;
    } else {
        println!("Something is wrong!");
        // this is a terrible way to handle errors
        // TODO:
        return PathBuf::from("");
    }
}

#[tauri::command]
fn check_installed(binary_name: &str) -> bool {
    use which::which;
    println!("Checking if {} is installed", binary_name);
    let is_installed: bool;
    match which(binary_name) {
        Ok(location) => {
            println!(
                "{} is installed! Located at: {}",
                binary_name,
                location.display()
            );
            is_installed = true;
            return is_installed;
        }
        Err(_err) => {
            println!(
                "Uh oh! Looks like {} is not installed. Let's mark it for installation...",
                binary_name
            );
            is_installed = false;
            return is_installed;
        }
    }
}

#[tauri::command]
fn backup_old_config(config_path: &str) {
    // Change process directory to the systems config folder
    match env::set_current_dir(config_path) {
        Ok(()) => println!("Changed process to config directory: {}", config_path),
        Err(err) => println!("{} {}", "Error: couldn't locate config directory {}", err),
    }

    // println!("{:?}", env::current_dir());

    match fs::metadata("nvim_old") {
        Ok(meta) => println!("{:?}", meta),
        Err(e) => println!("{}", e)
    }

    // Rename the nvim folder to nvim.old (backup)
    println!("{}", "Trying to rename nvim folder...");

    match fs::rename("nvim", "nvim_old") {
        Ok(()) => {
            println!("Old config back up complete \n \n")
        }
        Err(e) => {
            println!("{}", e)
        }
    }
}

#[tauri::command]
#[cfg(target_family = "unix")]
fn run_packer_install() {
    println!("running packer install");
    std::process::Command::new("neovide")
        // .arg("--headless")
        // .arg("-c")
        // .arg("autocmd User PackerComplete quitall")
        // .arg("-c")
        // .arg("PackerSync")
        .spawn()
        .expect("Error: Failed to run editor")
        .wait()
        .expect("Error: Editor returned a non-zero status");
}

#[tauri::command]
fn check_os() -> Type {
    let os = os_info::get();

    match os.os_type() {
        Type::Macos => Type::Macos,
        Type::EndeavourOS
        | Type::Arch
        | Type::Manjaro
        | Type::Ubuntu
        | Type::Pop
        | Type::Debian => Type::Linux,
        Type::Windows => Type::Windows,
        _ => Type::Linux,
    }
}

#[tauri::command]
fn try_install_binary(binary_name: &str) -> String {
    let mut package_manager = "pacman";
    let mut args = Vec::new();

    let os = os_info::get();

    match os.os_type() {
        Type::Macos => {
            println!("This is probably an apple laptop!");
            package_manager = "brew";
            args.push("install");
        }
        Type::EndeavourOS | Type::Arch | Type::Manjaro => {
            println!("You're on an Arch derivative");
            package_manager = "pacman";
            args.push("-S");
            args.push("--noconfirm")
        }
        Type::Ubuntu | Type::Pop | Type::Debian => {
            println!("You're on an Debian derivative");
            package_manager = "apt";
            args.push("install");
            args.push("-y");
            args.push("--force-yes");
        }
        Type::Windows => {
            //TODO
        }
        _ => {
            println!("Unsupported platform! TempleOS maybe? ");
        }
    }

    let install_command = Command::new(package_manager)
        .args(args)
        .arg(binary_name)
        .spawn()
        // .output()
        .expect("There was an error")
        .wait_with_output();

    println!("command done");

    match install_command {
        Ok(output) => return String::from_utf8(output.stdout).unwrap(),
        Err(err) => return err.to_string(),
    }
}

fn main() {
    tauri::Builder::default()
        // .invoke_handler(tauri::generate_handler![check_installed])
        .invoke_handler(tauri::generate_handler![
            try_install_binary,
            check_installed,
            check_os,
            backup_old_config,
            run_packer_install
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
