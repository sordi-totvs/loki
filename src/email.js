import nodemailer from "nodemailer"

export class Email {
    config = {
        service: 'gmail',
        auth: {
            user: 'user',
            pass: 'pass'
        },
        dest: "guilherme.sordi@totvs.com.br"
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
            to: this.config.dest,
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