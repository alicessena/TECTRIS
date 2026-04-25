# 📁 images

## 📌 Propósito

A pasta `images` é responsável por armazenar todos os **recursos visuais** utilizados no jogo, como sprites, texturas, backgrounds e elementos de interface.

Esses arquivos são essenciais para a renderização gráfica dentro do jogo, especialmente ao utilizar bibliotecas como a raylib.

---

## 📂 O que deve conter

Nesta pasta devem ser adicionados:

* Sprites de personagens
* Blocos (ex: peças do Tetris)
* Backgrounds
* Ícones de interface (botões, menus, HUD)
* Spritesheets (várias imagens em uma só)

### Exemplos:

```
images/
├── player.png
├── block_I.png
├── block_T.png
├── background.png
└── ui_button_start.png
```

---

## ⚠️ O que evitar

* ❌ Não adicionar arquivos de código (.c, .h)
* ❌ Evitar imagens não utilizadas no projeto
* ❌ Não usar nomes genéricos como `img1.png`, `teste.png`
* ❌ Evitar arquivos muito pesados sem necessidade

---

## 🧠 Boas práticas

* ✔️ Use nomes descritivos:

  * `block_L.png` ao invés de `image1.png`
* ✔️ Organize em subpastas se crescer muito:

  ```
  images/
  ├── blocks/
  ├── ui/
  └── backgrounds/
  ```
* ✔️ Prefira formatos leves como `.png`
* ✔️ Mantenha um padrão de tamanho (ex: todos os blocos com mesma dimensão)

---

## 📝 Observação

As imagens desta pasta devem ser carregadas no código utilizando funções da raylib, como:

```c
Texture2D texture = LoadTexture("assets/images/player.png");
```

Certifique-se de que o caminho está correto em relação à estrutura do projeto.

---

## 🚀 Importante

Todos os arquivos desta pasta fazem parte dos **assets do jogo**, portanto devem ser versionados no GitHub.

Isso garante que qualquer pessoa consiga rodar o projeto corretamente sem precisar baixar recursos externos.
