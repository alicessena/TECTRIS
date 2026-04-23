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

| Formato da Forma                                      | Descrição                                                                       | Exemplo (o que ilustrar)                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 🔵 Círculo preenchido (Início)                        | Representa o ponto inicial do fluxo do sistema                                  | Tela inicial do jogo sendo aberta                    |
| ⚫ Círculo com borda (Fim)                            | Indica o final de um fluxo ou processo                                          | Fim de uma partida ou término de uma ação            |
| ⬛ Retângulo (Ação)                                   | Representa uma ação ou etapa executada no sistema                               | "Exibir pergunta", "Mover peça", "Validar resposta"  |
| 🔷 Losango (Decisão)                                  | Representa uma condição (if/else), onde o fluxo pode seguir caminhos diferentes | "Resposta correta?" ou "Colidiu?"                    |
| ➡️ Seta (Fluxo)                                       | Indica a direção do fluxo entre as etapas                                       | Ligação entre ações (ex: da pergunta para validação) |
| 🟦 Retângulo com borda dupla (Subprocesso - opcional) | Representa um processo mais complexo que pode ser detalhado em outro diagrama   | "Processar pontuação" ou "Gerenciar lógica do jogo"  |
| 🧍‍♂️ Swimlane (Raia - opcional)                         | Divide responsabilidades entre usuário e sistema                                | Separar ações do jogador e do sistema no diagrama    |

# Diagrama dos BackLogs

## 1 . Jogar partida local

```
mermaid
flowchart TD

```

## 2. Sistema de queda de blocos

```
mermaid
flowchart TD

```

## 3. Perguntas de lógica durante o jogo

```
mermaid
flowchart TD

```

## 4. Sistema de pontuação

```
mermaid
flowchart TD

```

## 5. Penalidade por erro

```
mermaid
flowchart TD

```

## 6. Sistema de vitória

```
mermaid
flowchart TD

```

## 7. Sistema de tempo nas perguntas

```
mermaid
flowchart TD

```

## 8. Efeito competitivo (impactar adversário)

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> AcaoJogador

    AcaoJogador: Jogador acerta pergunta

    AcaoJogador --> ValidarAcerto

    ValidarAcerto --> AcertoConfirmado: [Resposta correta]
    ValidarAcerto --> NaoAplicavel: [Resposta incorreta]

    AcertoConfirmado --> SelecionarAdversario
    SelecionarAdversario: Identificar jogador oponente

    SelecionarAdversario --> EscolherEfeito

    EscolherEfeito --> ForcarPergunta
    EscolherEfeito --> AplicarAtraso

    ForcarPergunta: Enviar nova pergunta ao adversário
    AplicarAtraso: Reduzir velocidade\nou travar ações temporariamente

    ForcarPergunta --> AplicarEfeito
    AplicarAtraso --> AplicarEfeito

    AplicarEfeito --> AtualizarEstadoAdversario
    AtualizarEstadoAdversario: Modificar estado do oponente

    AtualizarEstadoAdversario --> ExibirFeedbackVisual
    ExibirFeedbackVisual: Mostrar efeito visual\nno adversário

    ExibirFeedbackVisual --> ConfirmarImpacto
    ConfirmarImpacto: Garantir que ação foi aplicada

    ConfirmarImpacto --> RetornarFluxoPrincipal
    RetornarFluxoPrincipal: Continuar jogo normalmente

    RetornarFluxoPrincipal --> [*]

    NaoAplicavel --> EncerrarFluxo
    EncerrarFluxo --> [*]
```

## 9. Interface do jogo (UI básica)

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> InicializarInterface

    InicializarInterface --> CriarLayoutBase
    CriarLayoutBase: Definir estrutura da tela

    CriarLayoutBase --> CriarTabuleiros
    CriarTabuleiros: Renderizar dois tabuleiros

    CriarTabuleiros --> ExibirPontuacao
    ExibirPontuacao: Mostrar pontuação inicial

    ExibirPontuacao --> OrganizarElementos
    OrganizarElementos: Ajustar alinhamento\nGarantir legibilidade

    OrganizarElementos --> RenderizarInterface
    RenderizarInterface: Exibir UI na tela

    RenderizarInterface --> IniciarLoopInterface

    IniciarLoopInterface --> AtualizarInterface
    AtualizarInterface: Atualizar pontuação\nAtualizar estado dos tabuleiros

    AtualizarInterface --> VerificarEstadoJogo

    VerificarEstadoJogo --> ContinuarAtualizacao: [Jogo em andamento]
    VerificarEstadoJogo --> EncerrarInterface: [Jogo finalizado]

    ContinuarAtualizacao --> IniciarLoopInterface

    EncerrarInterface --> ExibirTelaFinal
    ExibirTelaFinal: Mostrar resultado final

    ExibirTelaFinal --> [*]
```

## 10. Banco de perguntas (fixo/local)

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> InicializarSistema

    InicializarSistema --> LocalizarArquivo
    LocalizarArquivo: Identificar fonte local (JSON)

    LocalizarArquivo --> VerificarArquivo

    VerificarArquivo --> ArquivoEncontrado: [Arquivo disponível]
    VerificarArquivo --> ArquivoNaoEncontrado: [Arquivo ausente]

    ArquivoNaoEncontrado --> ExibirErroArquivo
    ExibirErroArquivo: Informar erro de carregamento

    ExibirErroArquivo --> EncerrarSistema
    EncerrarSistema --> [*]

    ArquivoEncontrado --> CarregarDados
    CarregarDados: Ler arquivo JSON local

    CarregarDados --> ValidarDados

    ValidarDados --> DadosValidos: [Estrutura correta]
    ValidarDados --> DadosInvalidos: [Erro no JSON]

    DadosInvalidos --> ExibirErroDados
    ExibirErroDados: Informar inconsistência

    ExibirErroDados --> EncerrarSistema

    DadosValidos --> ArmazenarPerguntas
    ArmazenarPerguntas: Salvar em memória

    ArmazenarPerguntas --> DisponibilizarPerguntas
    DisponibilizarPerguntas: Sistema pronto para uso

    DisponibilizarPerguntas --> VerificarModoOffline

    VerificarModoOffline --> ModoOffline: [Sem conexão]
    VerificarModoOffline --> ModoOnline: [Com conexão]

    ModoOffline --> OperarOffline
    OperarOffline: Usar apenas dados locais

    ModoOnline --> OperarNormal
    OperarNormal: Utilizar dados já carregados

    OperarOffline --> [*]
    OperarNormal --> [*]
```

## 11. Aumento de dificuldade progressiva

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> IniciarJogo

    IniciarJogo --> DefinirParametrosIniciais
    DefinirParametrosIniciais: Definir velocidade inicial\nDefinir tempo padrão

    DefinirParametrosIniciais --> IniciarLoopJogo

    IniciarLoopJogo --> ExecutarCicloJogo
    ExecutarCicloJogo: Rodada em andamento\n(blocos caindo / adivinhação)

    ExecutarCicloJogo --> VerificarProgresso

    VerificarProgresso --> AumentarDificuldade: [Critério atingido]
    VerificarProgresso --> ManterDificuldade: [Critério não atingido]

    AumentarDificuldade --> AjustarVelocidade
    AjustarVelocidade: Aumentar velocidade do jogo

    AjustarVelocidade --> ReduzirTempo
    ReduzirTempo: Diminuir tempo de resposta

    ReduzirTempo --> AtualizarParametros
    AtualizarParametros: Aplicar novas configurações

    AtualizarParametros --> ContinuarJogo

    ManterDificuldade --> ContinuarJogo

    ContinuarJogo --> VerificarFimJogo

    VerificarFimJogo --> FimJogo: [Jogo encerrado]
    VerificarFimJogo --> ContinuarLoop: [Jogo continua]

    ContinuarLoop --> IniciarLoopJogo

    FimJogo --> EncerrarPartida
    EncerrarPartida --> [*]

```

## 12. Feedback visual (acerto/erro)

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> AguardarResposta

    AguardarResposta --> ReceberResposta: Jogador envia resposta

    ReceberResposta --> ValidarResposta

    ValidarResposta --> RespostaCorreta: [Resposta correta]
    ValidarResposta --> RespostaIncorreta: [Resposta incorreta]

    RespostaCorreta --> ExibirFeedbackPositivo
    ExibirFeedbackPositivo: Mostrar cor verde\nExibir animação de acerto

    ExibirFeedbackPositivo --> AtualizarEstadoJogo
    AtualizarEstadoJogo: Liberar continuidade\nPontuar jogador

    AtualizarEstadoJogo --> ContinuarJogo

    RespostaIncorreta --> ExibirFeedbackNegativo
    ExibirFeedbackNegativo: Mostrar cor vermelha\nExibir animação de erro

    ExibirFeedbackNegativo --> AplicarPenalidade
    AplicarPenalidade: Reduzir vidas ou aplicar efeito

    AplicarPenalidade --> VerificarEstadoJogador

    VerificarEstadoJogador --> ContinuarJogo: [Ainda pode jogar]
    VerificarEstadoJogador --> GameOver: [Sem vidas]

    GameOver --> ExibirTelaGameOver
    ExibirTelaGameOver --> [*]

    ContinuarJogo --> RetornarLoop
    RetornarLoop --> AguardarResposta: Nova pergunta ou continuação
```

# Backlog do Sistema de Adivinhação

## 1. Sorteio do número secreto

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> IniciarRodada

    IniciarRodada --> DefinirIntervalo
    DefinirIntervalo: Definir intervalo [0 - 100]

    DefinirIntervalo --> GerarNumeroAleatorio
    GerarNumeroAleatorio: Gerar número pseudo-aleatório

    GerarNumeroAleatorio --> ValidarIntervalo

    ValidarIntervalo --> NumeroValido: [Número entre 0 e 100]
    ValidarIntervalo --> NumeroInvalido: [Fora do intervalo]

    NumeroInvalido --> GerarNumeroAleatorio: Regerar número

    NumeroValido --> ArmazenarNumero
    ArmazenarNumero: Salvar número secreto\n(oculto ao jogador)

    ArmazenarNumero --> OcultarNumero
    OcultarNumero: Garantir que não será exibido

    OcultarNumero --> PrepararRodada
    PrepararRodada: Sistema pronto para adivinhação

    PrepararRodada --> VerificarNovaRodada

    VerificarNovaRodada --> NovaRodada: [Nova rodada iniciada]
    VerificarNovaRodada --> [*]: [Fim do fluxo atual]

    NovaRodada --> IniciarRodada
```

## 2. Loop de adivinhação

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> IniciarLoopAdivinhacao

    IniciarLoopAdivinhacao --> SolicitarTentativa
    SolicitarTentativa: Solicitar número ao jogador

    SolicitarTentativa --> ReceberTentativa
    ReceberTentativa: Jogador insere tentativa

    ReceberTentativa --> ValidarEntrada

    ValidarEntrada --> EntradaValida: [Entrada numérica válida]
    ValidarEntrada --> EntradaInvalida: [Entrada inválida]

    EntradaInvalida --> ExibirErro
    ExibirErro: Informar erro ao jogador

    ExibirErro --> SolicitarTentativa

    EntradaValida --> CompararNumero

    CompararNumero --> Acertou: [Número correto]
    CompararNumero --> NaoAcertou: [Número incorreto]

    NaoAcertou --> VerificarCondicaoParada

    VerificarCondicaoParada --> ContinuarLoop: [Pode continuar]
    VerificarCondicaoParada --> EncerrarLoop: [Condição de parada atingida]

    ContinuarLoop --> SolicitarTentativa

    Acertou --> ExibirSucesso
    ExibirSucesso: Informar acerto ao jogador

    ExibirSucesso --> IntegrarFluxoPrincipal
    IntegrarFluxoPrincipal: Atualizar progresso no jogo

    IntegrarFluxoPrincipal --> [*]

    EncerrarLoop --> ExibirFalha
    ExibirFalha: Informar fim das tentativas ou condição atingida

    ExibirFalha --> IntegrarFluxoPrincipal

```

## 3. Validação da entrada

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> ReceberEntrada

    ReceberEntrada: Jogador insere valor

    ReceberEntrada --> VerificarTipoEntrada

    VerificarTipoEntrada --> EntradaNumerica: [É número]
    VerificarTipoEntrada --> EntradaNaoNumerica: [Não é número]

    EntradaNaoNumerica --> ExibirErroTipo
    ExibirErroTipo: Mostrar mensagem\n"Entrada inválida"

    ExibirErroTipo --> SolicitarNovaEntrada

    SolicitarNovaEntrada --> ReceberEntrada

    EntradaNumerica --> ValidarIntervalo

    ValidarIntervalo --> DentroIntervalo: [0 <= valor <= 100]
    ValidarIntervalo --> ForaIntervalo: [Valor inválido]

    ForaIntervalo --> ExibirErroIntervalo
    ExibirErroIntervalo: Mostrar mensagem\n"Fora do intervalo permitido"

    ExibirErroIntervalo --> SolicitarNovaEntrada

    DentroIntervalo --> EntradaValida
    EntradaValida: Entrada aceita pelo sistema

    EntradaValida --> RetornarParaFluxo
    RetornarParaFluxo: Enviar valor para lógica do jogo

    RetornarParaFluxo --> [*]

```

## 4. Feedback: “Muito baixo”

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> ReceberPalpite

    ReceberPalpite: Jogador insere tentativa válida

    ReceberPalpite --> ObterNumeroSecreto
    ObterNumeroSecreto: Recuperar valor armazenado

    ObterNumeroSecreto --> CompararValores

    CompararValores --> PalpiteMenor: [Palpite < Número secreto]
    CompararValores --> NaoAplicavel: [Palpite >= Número secreto]

    PalpiteMenor --> ExibirMensagemBaixo
    ExibirMensagemBaixo: Mostrar "Muito baixo"

    ExibirMensagemBaixo --> AtualizarInterface
    AtualizarInterface: Exibir feedback ao jogador

    AtualizarInterface --> RetornarLoop
    RetornarLoop: Permitir nova tentativa

    RetornarLoop --> [*]

    NaoAplicavel --> EncerrarFluxo
    EncerrarFluxo: Retornar ao fluxo principal

    EncerrarFluxo --> [*]

```

## 5. Feedback: “Muito alto”

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> ReceberPalpite

    ReceberPalpite: Jogador insere tentativa válida

    ReceberPalpite --> ObterNumeroSecreto
    ObterNumeroSecreto: Recuperar valor armazenado

    ObterNumeroSecreto --> CompararValores

    CompararValores --> PalpiteMaior: [Palpite > Número secreto]
    CompararValores --> NaoAplicavel: [Palpite <= Número secreto]

    PalpiteMaior --> ExibirMensagemAlto
    ExibirMensagemAlto: Mostrar "Muito alto"

    ExibirMensagemAlto --> AtualizarInterface
    AtualizarInterface: Exibir feedback ao jogador

    AtualizarInterface --> RetornarLoop
    RetornarLoop: Permitir nova tentativa

    RetornarLoop --> [*]

    NaoAplicavel --> EncerrarFluxo
    EncerrarFluxo: Retornar ao fluxo principal

    EncerrarFluxo --> [*]

```

## 6. Feedback: “Acertou”

```
mermaid
flowchart TD
stateDiagram-v2
    [*] --> ReceberPalpite

    ReceberPalpite: Jogador insere tentativa válida

    ReceberPalpite --> ObterNumeroSecreto
    ObterNumeroSecreto: Recuperar valor armazenado

    ObterNumeroSecreto --> CompararValores

    CompararValores --> Acertou: [Palpite == Número secreto]
    CompararValores --> NaoAplicavel: [Palpite != Número secreto]

    Acertou --> ExibirMensagemAcerto
    ExibirMensagemAcerto: Mostrar "Acertou"

    ExibirMensagemAcerto --> AtualizarInterface
    AtualizarInterface: Exibir feedback ao jogador

    AtualizarInterface --> AplicarRecompensa

    AplicarRecompensa: Adicionar pontos\nou bônus ao jogador

    AplicarRecompensa --> AtualizarEstadoJogo
    AtualizarEstadoJogo: Registrar progresso\nou avanço de fase

    AtualizarEstadoJogo --> IntegrarFluxoPrincipal
    IntegrarFluxoPrincipal: Notificar sistema principal

    IntegrarFluxoPrincipal --> EncerrarLoop
    EncerrarLoop: Finalizar rodada de adivinhação

    EncerrarLoop --> [*]

    NaoAplicavel --> EncerrarFluxo
    EncerrarFluxo: Retornar ao fluxo principal

    EncerrarFluxo --> [*]

```