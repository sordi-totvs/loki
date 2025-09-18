import * as fs from "fs"
import path from "path";
import {Shell} from "./shell.js"

export class CompareScript {
    scriptPath;

    constructor(scriptPath){
        this.scriptPath = scriptPath
    }

    prapare(projectPath){
        const from = path.join(projectPath, "package-lock.json")
        const to = path.join(this.scriptPath, "package-lock.json")

        if (!fs.existsSync(from)){
            throw `Arquivo não encontrado: package-lock.json`
        }

        fs.copyFileSync(from, to)
    }

    execute(projectPath){
        console.log("\nExecutando script de comparação (Tapia)...")
        const shell = new Shell(this.scriptPath)

        this.prapare(projectPath)
        shell.run(`${this.scriptPath}\\.venv\\Scripts\\python.exe ${this.scriptPath}\\comparar.py`)        

        const log = this.getLog()
        console.log(log)
        return log
    }

    getLog(){
        return fs.readFileSync(path.join(this.scriptPath, "comparar.log"), "utf8")
    }
}