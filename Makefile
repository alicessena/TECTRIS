# Alterar de acordo com o Jogo

# Nome do executável
TARGET = jogo

# Compilador
CC = gcc

# Flags
CFLAGS = -Wall -Wextra -Iinclude

# Pastas
SRC_DIR = src
BUILD_DIR = build

# Arquivos fonte
SRCS = $(wildcard $(SRC_DIR)/*.c)

# Objetos
OBJS = $(patsubst $(SRC_DIR)/%.c, $(BUILD_DIR)/%.o, $(SRCS))

# ===============================
# 🔧 CONFIGURAÇÃO RAYLIB
# ===============================

# 👉 Linux / WSL
# LDFLAGS = -lraylib -lm -ldl -lpthread -lGL -lX11

# 👉 Windows (MinGW)
# LDFLAGS = -lraylib -lopengl32 -lgdi32 -lwinmm

# ===============================

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CC) $(OBJS) -o $(TARGET) $(LDFLAGS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(BUILD_DIR) $(TARGET)

rebuild: clean all

run: all
	./$(TARGET)