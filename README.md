# Adonis.js Application

## Passo a Passo para Iniciar a Aplicação

### 1. Instalar as Dependências

Execute o comando abaixo para instalar todas as dependências do projeto:

```bash
yarn
cp .env.example .env
```

### 4. Instalar o FFmpeg

A aplicação requer o FFmpeg para funcionar corretamente. A instalação varia de acordo com o sistema operacional:

- **Windows**: Procure "instalar FFmpeg no Windows" na internet para seguir o guia adequado.
- **MacOS**: Pode ser instalado via Homebrew. Execute:

  ```bash
  brew install ffmpeg
  ```

- **Linux**: Use o gerenciador de pacotes da sua distribuição. Por exemplo:

  ```bash
  sudo apt install ffmpeg
  ```

### 5. Iniciar o Servidor

Execute o comando abaixo para iniciar o servidor de desenvolvimento:

```bash
yarn dev
```

### 6. Acessar a Aplicação

Abra o navegador e acesse:

```bash
http://localhost:3333/download
```
