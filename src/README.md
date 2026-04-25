# 📁 src

## 📌 Propósito

A pasta `src` (source) é o **coração do projeto**, onde fica todo o **código fonte em C** do jogo.

É aqui que a lógica do jogo é implementada, incluindo inicialização, regras, renderização e interação com o jogador.

---

## 📂 O que deve conter

Nesta pasta devem ser adicionados:

* Arquivos `.c` (implementações)
* Organização modular do código (separado por responsabilidade)

### Estrutura recomendada:

```id="s1r2c3"
src/
├── main.c
│
├── core/        # Controle principal do jogo
├── entities/    # Objetos do jogo (player, blocos, etc.)
├── systems/     # Regras (colisão, pontuação, lógica)
├── utils/       # Funções auxiliares
```

---

## ⚠️ O que evitar

* ❌ Não colocar arquivos compilados (ex: `.o`, `.exe`)
* ❌ Evitar concentrar todo o código em um único arquivo (`main.c`)
* ❌ Não misturar assets (imagens, sons)
* ❌ Evitar código desorganizado ou sem separação de responsabilidades

---

## 🧠 Boas práticas

* ✔️ Separar o código por responsabilidade (modularização)
* ✔️ Manter funções pequenas e organizadas
* ✔️ Usar nomes claros para arquivos e funções
* ✔️ Criar um `.c` para cada `.h` correspondente
* ✔️ Evitar dependências desnecessárias entre arquivos

---

## 📝 Observação

O ponto de entrada do programa é o arquivo `main.c`:

```c id="k3j8h1"
int main() {
    // inicialização
    // loop principal
    // finalização
}
```

Ele deve ser responsável apenas por iniciar o jogo e delegar o controle para outros módulos.

---

## 🚀 Importante

A organização da pasta `src` impacta diretamente:

* Legibilidade do código
* Facilidade de manutenção
* Escalabilidade do projeto

Uma boa estrutura aqui demonstra domínio de arquitetura de software, o que é um grande diferencial no GitHub.
