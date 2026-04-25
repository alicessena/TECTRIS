# 📁 build

## 📌 Propósito

A pasta `build` é responsável por armazenar todos os **arquivos gerados durante o processo de compilação** do projeto.

Isso inclui executáveis, arquivos objeto e outros artefatos temporários criados pelo compilador.

---

## 📂 O que deve conter

Nesta pasta serão gerados automaticamente:

* Arquivos objeto (`.o`)
* Executáveis (`.exe`, `.out`, ou sem extensão no Linux)
* Arquivos intermediários de build

### Exemplos:

```id="k9d2m1"
build/
├── main.o
├── game.o
├── player.o
└── meu-jogo.exe
```

---

## ⚠️ O que evitar

* ❌ Não adicionar código fonte (.c, .h)
* ❌ Não editar arquivos manualmente
* ❌ Não versionar essa pasta no GitHub

---

## 🧠 Boas práticas

* ✔️ Sempre gerar os arquivos automaticamente via `Makefile`
* ✔️ Limpar a pasta regularmente com um comando como:

  ```bash id="p4x8c7"
  make clean
  ```
* ✔️ Manter essa pasta fora do controle de versão

---

## 📝 Observação

Para evitar que os arquivos de build sejam enviados ao GitHub, adicione a pasta `build/` no arquivo `.gitignore`:

```id="n7v3l2"
build/
```

---

## 🚀 Importante

A pasta `build` pode existir no repositório apenas como estrutura (com este arquivo `.md`), mas **seu conteúdo deve ser ignorado pelo Git**.

Isso garante que o repositório fique mais leve, organizado e focado apenas no código fonte e nos assets necessários para rodar o projeto.
