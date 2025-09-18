import nodemailer from "nodemailer"

export class Email {
    config = {
        service: 'gmail',
        auth: {
            user: 'user',
            pass: 'pass'
        }
    }
    transporter;

    constructor (
        config
    ){
        this.config = config
        this.transporter = nodemailer.createTransport(config)
    }

    async send(subject, content){
        let mailOptions = {
            from: this.config.auth.user,
            to: `guilherme.sordi@totvs.com.br`,
            subject,
            html: content
        }
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar e-mail:', error);
            } else {
                console.log('E-mail enviado:', info.response);
            }
        })
    }
}