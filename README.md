# Loki

Identifica vulnerabilidades em projetos node.js e notifica por mensagem no Google Chat se encontrar vulnerabilidades críticas ou altas.

Criado com Node 22.19.0

## Pré-requisitos

Node.js instalado

## Execução dos Scripts

### 1 - Script index.js

Instalar dependências, revisar os dados em `config.json` e executar `index.js`. Ajustar git para não subir alterações no arquivo config.json.

Exemplo:
```
npm ci
node index.js
git update-index --assume-unchanged config.json  
```

#### Arquivo config.js

##### Configurations

Propriedade|Informação
---|---
`path`|Caminho do repositório local
`branch`|Branch que se deseja auditar, normalmente `main` ou `master`
`maxCritical`|Número máximo de vulnerabilidades *críticas* aceitável para não enviar notificação ao time
`maxHigh`|Número máximo de vulnerabilidades *altas* aceitável para não enviar notificação ao time
`chatWebhook`|End-point do webhook do Google Chat para enviar notificações. É o mesmo processo dessa doc: https://tdn.totvs.com/display/F1/Report+de+Testes+Automatizados

### 2 - Script backoffice.js

Instalar dependências, revisar os dados em `backoffice.json` e executar `backoffice.js`.

Exemplo:
```
npm ci
node backoffice.js
```

* Utilize o arquivo `backoffice.exemple.json` para gerar o seu arquivo `backoffice.json`

* O primeiro argumento passado para o script poderá ser o nome de um arquivo json, que será usado em vez do `backoffice.json`

Exemplo:
```
npm ci
node backoffice.js backoffice.test.json
```