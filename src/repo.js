import * as fs from 'fs';
import path from "path";
import {Shell} from "./shell.js"

export class Repo {
    name;
    url;
    gitName;
    localPath;
    shell;
    master;
    basePath;

    constructor(name, url, master = "master"){
        this.name = name;
        this.url = url;
        this.master = master

        this.gitName = url.split("/").pop()
        if( !this.gitName || this.gitName === "") {
            throw "Nome do projeto não identificado."
        }

        this.basePath = JSON.parse(fs.readFileSync("backoffice.json")).localPath;
        this.localPath = path.join(this.basePath, this.gitName.replace(".git",""));
        fs.mkdirSync(this.localPath, {recursive: true});
        this.shell = new Shell(this.localPath);
    }

    pull(){
        if (!fs.existsSync(path.join(this.localPath, ".git"))){
            this.clone();            
            if (!fs.existsSync(path.join(this.localPath, ".git"))){
                throw `Falha no clone do repositório ${this.url} em ${this.localPath}`;
            }
        }
        console.log(`Atualizando o repositório (pull)`);

        this.shell.run(`git checkout ${this.master}`);
        this.shell.run(`git pull`);
    }

    clone(){
        console.log(`Clonando o repositório em ${this.localPath}`)
        const shell = new Shell(this.basePath); //clone é o único comando que vou executar na pasta um nível acima
        shell.run(`git clone ${this.url}`);
    }    

    getPath(){
        return this.localPath;
    }

    getGitName(){
        return this.gitName;
    }
}