import * as fs from "fs"
import { Audit } from "./src/audit.js";
import { Repo } from './src/repo.js';

const configuration = JSON.parse(fs.readFileSync("backoffice.json"))

for (const config of configuration.configurations) {           
    for (const project of config.projects) {
        try {            
            const repo = new Repo(project.name, project.git, project.branch);
            
            console.log(`\n\n==============================================`)
            console.log(`\nProjeto: ${project.name}\nRepositório: ${repo.getGitName()}\nBranch: ${project.branch}`);

            // if (project.git.includes(`visualstudio`)){
            //     "Pulando projeto do Azure..."
            // }

            repo.pull();
            
            const audit = new Audit(repo.getPath(), project.branch);
            audit.execute();
            console.log(`\nRESULTADO`);
            console.log(audit.getResult());
        } catch (error) {
            console.error(error)
        } 
    }
};