import * as fs from "fs"
import { Audit } from "./src/audit.js";
import { Repo } from './src/repo.js';
import { Report } from './src/report.js';
import { Email } from './src/email.js'

const configuration = JSON.parse(fs.readFileSync("backoffice.json"))

var results = []

for (const config of configuration.configurations) {           
    for (const project of config.projects) {
        try {      
            let result = {}      
            const repo = new Repo(project.name, project.git, project.branch);
            
            console.log(`\n\n==============================================`)
            console.log(`\nProjeto: ${project.name}\nRepositório: ${repo.getGitName()}\nBranch: ${project.branch}`);

            result['squad'] = config.squad
            result['project'] = project
            result['repo'] = repo.getGitName().replace(".git","")

            repo.pull();
            
            const audit = new Audit(repo.getPath(), project.branch);
            audit.execute();
            console.log(`\nRESULTADO`);
            console.log(audit.getResult());

            result['audit'] = audit.getAuditResult();

            results.push(result);
        } catch (error) {
            console.error(error)
        } 
    }
};

if (configuration.email && configuration.email.auth) {
    const email = new Email(configuration.email);
    const subject = `Backoffice - Relatório de vulnerabilidades NPM (${(new Date()).toLocaleDateString})`
    const content = new Report().getHtml(results);
    email.send(subject, content);
}