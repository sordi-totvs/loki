import { execSync } from 'child_process';

export class Shell {
    path;

    constructor (path) {
        this.path = path
    }    

    run(command, options = {}) {
        try {
            return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], cwd: this.path, ...options }).trim();
        } catch (error) {

            // Para npm audit, status 1 é esperado se houver vulnerabilidades
            if (command.includes('npm audit') && error.status === 1) {
                return error.stdout.trim();
            }

            console.error(`Erro ao executar comando '${command}': \n\t${error.message}`);
            process.exit(1);
        }
    }
}