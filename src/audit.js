import * as fs from "fs";
import path from "path";
import {Shell} from "./shell.js"

export class Audit {
    SEVS = ["critical", "high", "moderate", "low"];
    projectDir;
    master;
    messenger;
    maxCritical = 0;
    maxHigh = 0;
    shell;
    auditResult;
    

    constructor(projectDir, master = "master", messenger){
        this.projectDir = projectDir,
        this.master = master,
        this.messenger = messenger

        this.shell = new Shell(projectDir);

        this.auditResult = {
            counter: {
                critical: 0,
                high: 0,
                moderate: 0,
                low: 0
            }}
    }

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

        console.log(this.run(`git checkout ${this.master}`))
        console.log(this.run(`git pull`))

        this.execute();
        
        console.log(this.getResult())

        if ((this.auditResult.counter.critical + this.auditResult.counter.high > 0) && this.messenger){
            await this.sendMessage(this.getResult)
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
    }

    vulnCount(auditJson){    
        const vulns = Object.values(auditJson.vulnerabilities || {});

        for (const sev of this.SEVS){                
            let count = vulns.filter(vuln => vuln.severity.toLowerCase() === sev.toLowerCase()).length;
            this.auditResult.counter[sev] = count
        }
    }

    async sendMessage(){
        console.log("Enviando mensagem...");
        
        let text = ""
        text = `*LOKI*\n\n`
        text += this.getProjectInfo() + `\n`
        text += this.getResult()

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

    getAuditResult(){
        return this.auditResult;
    }

    getResult(){
        var result = ""
        for (const sev of this.SEVS){
            result += `${(result!="" ? `\n` : "")}Encontrada(s) ${this.auditResult.counter[sev]} vulnerabilidade(s) "${sev}"`;
        }
        return result
    }
}