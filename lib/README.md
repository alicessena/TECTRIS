# 📁 lib

## 📌 Propósito

A pasta `lib` é responsável por armazenar **bibliotecas externas** utilizadas no projeto.

Essas bibliotecas podem ser arquivos já compilados ou códigos de terceiros que auxiliam no desenvolvimento do jogo, como a própria raylib ou outras dependências.

---

## 📂 O que deve conter

Nesta pasta podem ser adicionados:

* Bibliotecas compiladas (`.a`, `.lib`, `.dll`, `.so`)
* Dependências externas do projeto
* Código de bibliotecas de terceiros (quando necessário)

### Exemplos:

```id="v6b2k9"
lib/
├── libraylib.a
├── raylib.dll
└── outras_bibliotecas/
```

---

## ⚠️ O que evitar

* ❌ Não adicionar código principal do projeto (.c, .h próprios)
* ❌ Evitar duplicar bibliotecas já instaladas no sistema
* ❌ Não misturar assets (imagens, sons) com bibliotecas
* ❌ Evitar arquivos desnecessários ou não utilizados

---

## 🧠 Boas práticas

* ✔️ Usar essa pasta apenas quando necessário (ex: ambientes sem instalação global)
* ✔️ Documentar no `README.md` como configurar as dependências
* ✔️ Manter compatibilidade com diferentes sistemas (Windows/Linux)
* ✔️ Organizar por tipo, se houver muitas libs:

  ```
  lib/
  ├── windows/
  ├── linux/
  └── mac/
  ```

---

## 📝 Observação

Para utilizar bibliotecas dessa pasta, é necessário configurar o `Makefile` com os caminhos corretos:

```bash id="p9o8i7"
-Llib
-lraylib
```

Exemplo de compilação:

```bash id="u1y2t3"
gcc src/main.c -o build/game -Iinclude -Llib -lraylib
```

---

## 🚀 Importante

Nem sempre é necessário versionar bibliotecas no GitHub.

* Se a biblioteca for fácil de instalar (ex: raylib via gerenciador de pacotes), prefira **não subir** e apenas documentar no `README`.
* Se for uma dependência difícil de configurar, pode ser útil incluí-la aqui.

Essa decisão impacta diretamente no tamanho e na portabilidade do projeto.
