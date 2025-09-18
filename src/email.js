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
            // to: `guilherme.sordi@totvs.com.br`,
            to: "Guilherme Augusto de Sordi Nogueira Guedes <guilherme.sordi@totvs.com.br>,Ronaldo Tapia <ronaldo.tapia@totvs.com.br>,Deijai Miranda Almeida <deijai.almeida@totvs.com.br>,LEANDRO DE ALMEIDA FINI <fini.leandro@totvs.com.br>,Fabio Henrique Andrade Silva <fabioh.andrade@totvs.com.br>,Gianluca Moreira <g.moreira@totvs.com.br>,Willian Luiz Nunes Alves <willian.alves@totvs.com.br>,Marjorie Yuri Taki <marjorie.taki@totvs.com.br>,Clemente Xavier de Oliveira Neto <clemente.neto@totvs.com.br>,Rodrigo Guimaraes Soares <rodrigo.gsoares@totvs.com.br>,Marluci Helena De Oliveira <marluci.oliveira@totvs.com.br>,Iolanda Vilanova Cipriano <iolanda.cipriano@totvs.com.br>",
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