# 📁 include

## 📌 Propósito

A pasta `include` é responsável por armazenar os **arquivos de cabeçalho (.h)** do projeto.

Esses arquivos definem as **interfaces do sistema**, ou seja, as funções, estruturas e constantes que podem ser utilizadas em diferentes partes do código.

---

## 📂 O que deve conter

Nesta pasta devem ser adicionados:

* Arquivos `.h` globais
* Definições de estruturas (`struct`)
* Protótipos de funções
* Constantes e macros compartilhadas

### Exemplos:

```id="f8k2l1"
include/
├── game.h
├── player.h
├── block.h
└── utils.h
```

---

## ⚠️ O que evitar

* ❌ Não adicionar implementações (.c)
* ❌ Evitar lógica complexa dentro dos headers
* ❌ Não duplicar definições já existentes
* ❌ Evitar includes desnecessários

---

## 🧠 Boas práticas

* ✔️ Sempre proteger os headers contra múltiplas inclusões:

```c id="g1h2j3"
#ifndef PLAYER_H
#define PLAYER_H

// conteúdo

#endif
```

* ✔️ Ou usar `#pragma once` (mais moderno e simples):

```c id="m9n8b7"
#pragma once
```

* ✔️ Separar bem definição (no `.h`) e implementação (no `.c`)
* ✔️ Usar nomes consistentes com os arquivos `.c`

---

## 📝 Observação

Os arquivos desta pasta são utilizados no código através da diretiva `#include`:

```c id="t6y5u4"
#include "player.h"
#include "game.h"
```

Se o `Makefile` estiver configurado corretamente, você pode incluir a pasta `include/` no caminho de busca:

```bash id="r4e3w2"
-Iinclude
```

---

## 🚀 Importante

A separação entre `include/` e `src/` segue um padrão profissional amplamente utilizado em projetos C.

Isso facilita:

* Reutilização de código
* Organização do projeto
* Escalabilidade
* Manutenção futura

Essa estrutura também demonstra boas práticas para quem visualizar seu repositório no GitHub.
