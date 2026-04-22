
<div align="center">
  <img src="https://i.imgur.com/Ur8TtyZ.png" alt="Tectris Logo" width="400">
</div>

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/TE-C-TRIS/LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/tectris/tectris/actions)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

[![GitHub commits](https://badgen.net/github/commits/TE-C-TRIS/TECTRIS)](https://github.com/TE-C-TRIS/TECTRIS/commits/)
[![GitHub latest commit](https://badgen.net/github/last-commit/TE-C-TRIS/TECTRIS)](https://badgen.net/github/last-commit/TE-C-TRIS/TECTRIS)
[![GitHub issues](https://badgen.net/github/issues/TE-C-TRIS/TECTRIS)](https://GitHub.com/TE-C-TRIS/TECTRIS/issues/)
<br>

[![GitHub Org's stars](https://img.shields.io/github/stars/TE-C-TRIS/TECTRIS.svg?style=social&label=Stars)](https://github.com/TE-C-TRIS/TECTRIS/stargazers)
[![GitHub Org's forks](https://img.shields.io/github/forks/TE-C-TRIS/TECTRIS.svg?style=social&label=Fork)](https://github.com/TE-C-TRIS/TECTRIS/fork)
[![GitHub Org's followers](https://img.shields.io/github/followers/TE-C-TRIS.svg?style=social&label=Follow)](https://github.com/TE-C-TRIS)

<br>

[![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/kRNpjNgWIFwauorghAjyIY/Tectris-Design-System---Primeira-Vers%C3%A3o?node-id=64-3864&p=f&t=RYiLQKL7cvNZuk9i-0)
[![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=for-the-badge&logo=Trello&logoColor=white)](https://trello.com/invite/b/69cadb5e6451c7e81081f2af/ATTI17b970f7bb190cbabe4d257b4311c5dfC761625F/projeto-integrado)
</div>

# Diagramas UML das Funcionalidades
Os <b>diagramas UML (Unified Modeling Language)</b> são representações visuais utilizadas para descrever, planejar e documentar sistemas de software. Eles permitem visualizar a estrutura e o comportamento da aplicação, facilitando o entendimento das funcionalidades e dos fluxos do sistema.

A utilização de diagramas UML é importante porque ajuda a organizar as ideias antes da implementação, melhora a comunicação entre os membros da equipe e garante maior clareza sobre como o sistema deve funcionar. Além disso, servem como documentação do projeto, permitindo que outras pessoas compreendam e contribuam com mais facilidade no desenvolvimento.


## Guia Rápido de Diagramas UML (Atividades)

| Formato da Forma | Descrição | Exemplo (o que ilustrar) |
|------------------|----------|--------------------------|
| 🔵 Círculo preenchido (Início) | Representa o ponto inicial do fluxo do sistema | Tela inicial do jogo sendo aberta |
| ⚫ Círculo com borda (Fim) | Indica o final de um fluxo ou processo | Fim de uma partida ou término de uma ação |
| ⬛ Retângulo (Ação) | Representa uma ação ou etapa executada no sistema | "Exibir pergunta", "Mover peça", "Validar resposta" |
| 🔷 Losango (Decisão) | Representa uma condição (if/else), onde o fluxo pode seguir caminhos diferentes | "Resposta correta?" ou "Colidiu?" |
| ➡️ Seta (Fluxo) | Indica a direção do fluxo entre as etapas | Ligação entre ações (ex: da pergunta para validação) |
| 🟦 Retângulo com borda dupla (Subprocesso - opcional) | Representa um processo mais complexo que pode ser detalhado em outro diagrama | "Processar pontuação" ou "Gerenciar lógica do jogo" |
| 🧍‍♂️ Swimlane (Raia - opcional) | Divide responsabilidades entre usuário e sistema | Separar ações do jogador e do sistema no diagrama |

# Diagrama dos BackLogs

## 1 . Jogar partida local

```mermaid
flowchart TD

A([Início]) --> B[Iniciar partida]
B --> C[Inicializar jogadores P1 e P2]
C --> D[Iniciar queda dos blocos]

D --> E[Exibir pergunta]

E --> F[Jogadores tentam responder]

F --> G{Quem respondeu primeiro?}

G --> H[Capturar resposta do jogador]

H --> I{Resposta correta?}

I -->|Sim| J[Adicionar pontos ao jogador]
I -->|Não| K[Aplicar penalidade]

J --> L[Atualizar pontuação]
K --> L

L --> M[Exibir feedback visual]

M --> N{Algum jogador >= 100?}

N -->|Não| D
N -->|Sim| O[Determinar vencedor]

O --> P([Fim])
```

## 2. Sistema de queda de blocos

## 3. Perguntas de lógica durante o jogo

## 4. Sistema de pontuação

## 5. Penalidade por erro

## 6. Sistema de vitória

## 7. Sistema de tempo nas perguntas

## 8. Efeito competitivo (impactar adversário)

## 9. Interface do jogo (UI básica)

## 10. Banco de perguntas (fixo/local)

## 11. Aumento de dificuldade progressiva

## 12. Feedback visual (acerto/erro)

# Backlog do Sistema de Adivinhação

## 1. Sorteio do número secreto

## 2. Loop de adivinhação

## 3. Validação da entrada

## 4. Feedback: “Muito baixo”

## 5. Feedback: “Muito alto”

## 6. Feedback: “Acertou”


