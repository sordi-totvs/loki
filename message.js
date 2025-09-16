import axios from "axios";

export class Message {
    async send(text) {
        let endpoint = "https://chat.googleapis.com/v1/spaces/AAQAxmXEEek/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=3m8Fv1xw-9Ef6GbUwXshVEmeDoKZWKCjYt3CejEozZE"

        try {
            let response = await axios.post(endpoint, { text });
            console.log(response.statusText);
            console.log("Mensagem enviada.")
        } catch (error) {
            console.log("Erro na requisição ao enviar mensagem.");
            console.log(error);
        }
    }
}