import * as fs from "fs"
import { Audit } from "./src/audit.js";
import { Repo } from './src/repo.js';
import { Report } from './src/report.js';
import { Email } from './src/email.js'
import { CompareScript } from './src/compare-script.js'

const configuration = JSON.parse(fs.readFileSync("backoffice.json"))

var results = []

configuration.configurations.sort((a, b) => a.squad - b.squad);

if (configuration.compareScript && (configuration.compareScript != "")){
    var compare = new CompareScript(configuration.compareScript)
}   

for (const config of configuration.configurations) {    

    config.projects.sort((a, b) => a.name - b.name);
    
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

            if (compare){
                try {
                    result['compare'] = { log: compare.execute(repo.getPath()) }
                } catch (error) {
                    result['compare'] = { log: error }                    
                }
            }

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