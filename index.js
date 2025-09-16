import { Audit } from "./audit.js";

const contratos = new Audit("C:\\git\\portal-de-contratos", "master")
const receitas = new Audit("c:\\git\\receitas\\grr-client", "main")
var success = 0

try {
     await contratos.execute()
} catch (error) {
     console.error(error)
     success = 1
}

try {
     await receitas.execute()
} catch (error) {
     console.error(error)
     success = 1
}

process.exit(success)