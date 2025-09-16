import { execSync } from 'child_process';
import * as fs from "fs";
import path from "path";
import { Message } from './message.js';

export class Audit {
    projectDir;
    master;

    constructor(projectDir, master = "master"){
        this.projectDir = projectDir,
        this.master = master
    }

    result = "";

    async execute(){
        if (!fs.existsSync(".git")){
            throw "Não é um diretório GIT válido."
        }

        this.run(`git stash -u `)
        const branchBackup = this.run('git rev-parse --abbrev-ref HEAD');

        console.log(`\nDiretório atual: ${process.cwd()}`);
        console.log(`Branch atual: ${branchBackup}`);
        console.log("Executando npm audit...")
        const auditOutput = this.run('npm audit --json');
        const auditJson = JSON.parse(auditOutput);

        let critical = this.vulnCount(auditJson, "critical")
        let high = this.vulnCount(auditJson, "high")
        let moderate = this.vulnCount(auditJson, "moderate")
        let low = this.vulnCount(auditJson, "low")
        
        console.log(this.result)

        if (critical+high > 0){
            await this.sendMessage(this.result)
        } else {
            console.log(`Mensagem não será enviada.`)
        }

        if (branchBackup != this.master){
            this.run(`git checkout ${branchBackup}`)
            this.run(`git stash pop `)
        }
    }

    run(command, options = {}) {
        try {
            return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], cwd: this.projectDir, ...options }).trim();
        } catch (error) {

            // Para npm audit, status 1 é esperado se houver vulnerabilidades
            if (command.includes('npm audit') && error.status === 1) {
                return error.stdout.trim();
            }

            console.error(`Erro ao executar comando '${command}': ${error.message}`);
            process.exit(1);
        }
    }

    vulnCount(auditJson, auditLevel){    
        const vulns = Object.values(auditJson.vulnerabilities || {});
        let count = vulns.filter(vuln => vuln.severity.toLowerCase() === auditLevel.toLowerCase()).length;
        this.result += `${(this.result!="" ? `\n` : "")}Encontradas ${count} vulnerabilidades "${auditLevel}"`;
        return count
    }

    async sendMessage(){
        console.log("Enviando mensagem...");
        const message = new Message();
        
        let text = ""
        text = `*LOKI*\n\n`
        text += this.getProjectInfo() + `\n`
        text += this.result

        await message.send(text);
    }

    getProjectInfo(){
        const file = path.join(this.projectDir, "package.json")
        const pac = JSON.parse(fs.readFileSync(file, 'utf8'))
        const project = `Projeto: *${pac.name}*\nVersão: ${pac.version}\n`;
        return project
    }
}