import * as fs from "fs";
import path from "path";
import {Shell} from "./shell.js"

export class Audit {
    projectDir;
    master;
    messenger;
    maxCritical = 0;
    maxHigh = 0;
    counter = {
        critical: 0,
        high: 0,
        moderate: 0,
        low: 0
    }
    shell;
    

    constructor(projectDir, master = "master", messenger){
        this.projectDir = projectDir,
        this.master = master,
        this.messenger = messenger

        this.shell = new Shell(projectDir);
    }

    result = "";

    run(command){
        return this.shell.run(command)
    }

    async stashAndExecute(){
        if (!fs.existsSync(".git")){
            throw "Não é um diretório GIT válido."
        }

        this.run(`git stash -u `)
        const branchBackup = this.run('git rev-parse --abbrev-ref HEAD');
        
        console.log(`\nDiretório atual: ${process.cwd()}`);
        console.log(`Branch atual: ${branchBackup}`);

        this.execute();

        if ((this.counter.critical + this.counter.high > 0) && this.messenger){
            await this.sendMessage(this.result)
        } else {
            console.log(`Mensagem não será enviada.`)
        }

        if (branchBackup != this.master){
            this.run(`git checkout ${branchBackup}`)
            this.run(`git stash pop `)
        }
    }

    execute(){
        console.log("Executando npm audit...")
        const auditOutput = this.run('npm audit --json');
        const auditJson = JSON.parse(auditOutput);
        
        this.vulnCount(auditJson);
        
        console.log(this.result)
    }

    vulnCount(auditJson){    
        const vulns = Object.values(auditJson.vulnerabilities || {});

        for (const sev of ["critical", "high", "moderate", "low"]){                
            let count = vulns.filter(vuln => vuln.severity.toLowerCase() === sev.toLowerCase()).length;
            this.result += `${(this.result!="" ? `\n` : "")}Encontradas ${count} vulnerabilidades "${sev}"`;
            this.counter[sev] = count
        }
    }

    async sendMessage(){
        console.log("Enviando mensagem...");
        
        let text = ""
        text = `*LOKI*\n\n`
        text += this.getProjectInfo() + `\n`
        text += this.result

        await this.messenger.send(text);
    }

    getProjectInfo(){
        const file = path.join(this.projectDir, "package.json")
        const pac = JSON.parse(fs.readFileSync(file, 'utf8'))
        const project = `Projeto: *${pac.name.replace("pj-gct","portal-de-contratos")}*\nVersão: ${pac.version}\n`;
        return project
    }

    setMax(critical = 0, high = 0){
        this.maxCritical = critical;
        this.maxHigh = high;
    }

    getResult(){
        return this.result
    }
}