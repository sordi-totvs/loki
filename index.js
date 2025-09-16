import { Audit } from "./audit.js";
import * as fs from "fs"
import { Message } from './message.js';

const configuration = JSON.parse(fs.readFileSync("config.json"))
var exitValue = 0

for (const config of configuration.configurations) {           
     try {
          const audit = new Audit(config.path, config.branch, new Message(config.chatWebhook));
          audit.setMax(config.maxCritical, config.maxHigh);
          await audit.execute()
     } catch (error) {
          console.error(error)
          exitValue += 1
     } 
};

process.exit(exitValue)