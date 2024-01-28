# 🚀 ChatXpress

**ChatXpress** offers a high-performance, user-friendly interface clone of ChatGPT. It is built with Tauri and SolidJS. This allows for a fast, responsive, and stable experience comparable or superior to the original ChatGPT.



## 📚 Key Features:

- **Performance**: Written in Rust, ensuring a swift and responsive UI / chat experience.
- **Sleek UI**: The interface mirrors the old ChatGPT interface, facilitating a familiar and seamless user experience.
- **Customizable Chatbot**: This utilizes the assistants API to interact with the open ai API. So users can setup their assistants in the API and they will automatically be detected by the app. 
- **[PLANNED] Spending Tracker**: An upcoming feature that will display the cost/token on the chat window to easily see how much you're spending.
- **[PLANNED] Plugins**: An upcoming feature that lets users craft personalized plugins for the bot, enabling more dynamic interactions and responses.

## 📘 Relevant Documentation:

- **Tauri**: [Official Documentation](https://tauri.app/v1/guides/)
- **TailwindCSS**: [Official Documentation](https://tailwindcss.com/)
- **SolidJS**: [Official Documentation](https://www.solidjs.com/guides/getting-started)
- **OpenAI API**: [API Reference](https://beta.openai.com/docs/api-reference/introduction)

## ⚙️ Setup and Running the App:

## Manual:
[Install Rust](https://www.rust-lang.org/tools/install)

Install Tauri Cli
```bash
  cargo install tauri-cli
```
[Install Node](https://nodejs.org/en/download) or [Install Bun](https://bun.sh/docs/installation)

NOTE - If you don't install bun you'll need to edit the before build command in [tauri.conf.json](./src-tauri/tauri.conf.json)

Install node dependencies
```bash
  npm install
```
Or

```bash
  bun install
```

Build Project
```bash
  cargo tauri build
```

It will output the executable in /src-tauri/target/release/

### Windows Users:

An installer will be available eventually.

### Linux Users:

A package will be available eventually.

### OSX Users:

A package will be available, but no support will be provided. Manual instructions should work as well.


