# Loki

Identifica vulnerabilidades em projetos node.js e notifica por mensagem no Google Chat se encontrar vulnerabilidades críticas ou altas.

## Pré-requisitos

Node.js instalado

## Execução

Instalar dependências, revisar os dados em `config.json` e executar `index.js`

Exemplo:
```
npm ci
node index.js
```

## Arquivo config.js

### Configurations

Propriedade|Informação
---|---
`path`|Caminho do repositório local
`branch`|Branch que se deseja auditar, normalmente `main` ou `master`
`maxCritical`|Número máximo de vulnerabilidades *críticas* aceitável para não enviar notificação ao time
`maxHigh`|Número máximo de vulnerabilidades *altas* aceitável para não enviar notificação ao time
`chatWebhook`|End-point do webhook do Google Chat para enviar notificações. É o mesmo processo dessa doc: https://tdn.totvs.com/display/F1/Report+de+Testes+Automatizados
