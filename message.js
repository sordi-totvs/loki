import axios from "axios";
export class Message {
    endpoint;

    constructor(chatWebhook){
        this.endpoint = chatWebhook
    }

    async send(text) {        
        try {
            let response = await axios.post(this.endpoint, { text });
            console.log(`Resposta: ${response.statusText}`);
        } catch (error) {
            console.log("Erro na requisição ao enviar mensagem.");
            console.log(error);
        }
    }
}