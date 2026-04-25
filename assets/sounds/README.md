# 📁 sounds

## 📌 Propósito

A pasta `sounds` é responsável por armazenar todos os **recursos de áudio** do jogo, incluindo efeitos sonoros e músicas de fundo.

Esses elementos são fundamentais para melhorar a imersão e o feedback do jogador durante a gameplay.

---

## 📂 O que deve conter

Nesta pasta devem ser adicionados:

* Efeitos sonoros (SFX)

  * colisões
  * movimentação
  * ações (ex: girar peça, limpar linha)
* Músicas de fundo (BGM)
* Sons de interface (cliques, menus, notificações)

### Exemplos:

```id="h2k91d"
sounds/
├── move.wav
├── rotate.wav
├── line_clear.wav
├── game_over.wav
└── background_music.mp3
```

---

## ⚠️ O que evitar

* ❌ Não adicionar arquivos de código (.c, .h)
* ❌ Evitar arquivos duplicados ou não utilizados
* ❌ Não usar nomes genéricos como `audio1.wav`, `som_teste.mp3`
* ❌ Evitar arquivos muito pesados sem necessidade

---

## 🧠 Boas práticas

* ✔️ Use nomes descritivos:

  * `line_clear.wav` ao invés de `sound1.wav`
* ✔️ Separe por categorias, se necessário:

  ```
  sounds/
  ├── sfx/
  └── music/
  ```
* ✔️ Prefira formatos adequados:

  * `.wav` para efeitos curtos (melhor desempenho)
  * `.mp3` ou `.ogg` para músicas
* ✔️ Normalize o volume dos áudios para manter consistência

---

## 📝 Observação

Os sons desta pasta devem ser carregados no código utilizando funções da raylib, como:

```c id="z7x4p2"
InitAudioDevice();

Sound fx = LoadSound("assets/sounds/move.wav");
PlaySound(fx);

Music music = LoadMusicStream("assets/sounds/background_music.mp3");
PlayMusicStream(music);
```

Lembre-se de atualizar a música com `UpdateMusicStream(music);` dentro do loop principal.

---

## 🚀 Importante

Todos os arquivos desta pasta fazem parte dos **assets do jogo**, portanto devem ser versionados no GitHub.

Além disso, sempre finalize corretamente o uso de áudio no código:

```c id="q1w2e3"
UnloadSound(fx);
UnloadMusicStream(music);
CloseAudioDevice();
```

Isso evita vazamento de memória e problemas de desempenho.
