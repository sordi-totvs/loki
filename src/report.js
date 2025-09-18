
import * as marked from "marked"
import * as fs from "fs"
import path from "path"

export class Report {
    getMd(results){
        var md = ""
        var squads = ""

        md += `\n# Tovs Backoffice Linha Protheus`
        md += `\n# Análise de vulnerabilidades NPM`
        md += `\n###### ${(new Date().toLocaleDateString())}`
        
        for (const result of results){
            try {
                if (!squads.includes(result.squad)){
                    md += `\n## ${result.squad}`;
                    squads += `${result.squad}-`
                }

                md += `\n### ${result.project.name} ${this.getIcon(result)}`
                md += `\n###### Repositório: ${result.repo} (*${result.project.branch}*)`
                
                md += `\n##### Auditoria NPM`

                var sum = 0
                md += `\n|Severidade|Quantidade|`
                md += `\n|---|---:|`
                for (const sev of Object.keys(result.audit.counter)) {
                    md += `\n|*${sev}* | ${result.audit.counter[sev]}|`
                    sum += result.audit.counter[sev]
                }
                md += `\n|**Total** | **${sum}**|`

                md += `\n##### Análise por planilha`
                md += `\n(em breve)`
                md += `\n___`
            } catch {
                md += `[resultado inválido]`
            }
        }    
        
        return md
    }

    getIcon(result){
        if (result.audit.counter.critical > 0){
            return "🚨";                        
        }
        if (result.audit.counter.high > 0){
            return "⚠️";
        }
        return "✅";
    }

    getHtml(results){
        return `<html><head><style>${this.getCss()}</style></head><body> ${marked.parse(this.getMd(results))} </body></html>` ;
    }

    getCss(){
        return fs.readFileSync(path.join("assets", "style.css"), 'utf8');        
    }
}