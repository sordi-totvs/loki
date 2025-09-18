
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
                if(result.compare){
                    md += `\n${result.compare.log}`
                } else {
                    md += `\n(resultado indisponível)`
                }
                md += `\n___`
            } catch (error) {
                md += `\n[resultado inválido]\n${error}`

            }
        }    
        
        return this.putIcons(md)
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

    putIcons(text){
        text = text.replaceAll(`[OK]`, "✅")
        text = text.replaceAll(`[ALERT]`, "⚠️")
        text = text.replaceAll(`[X]`, "❌")
        return text
    }

    getHtml(results){
        return `<html><head><style>${this.getCss()}</style></head><body> ${marked.parse(this.getMd(results))} </body></html>` ;
    }

    getCss(){
        return fs.readFileSync(path.join("assets", "style.css"), 'utf8');        
    }
}