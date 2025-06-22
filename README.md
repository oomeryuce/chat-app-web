# Web Chat Application Frontend Project 3389

This project is a modern **web (frontend) chat application** developed as part of a thesis at University American College Skopje.
It is built using Nuxt.js (Vue.js) and is designed to connect with a Laravel 8 backend for real-time chat functionality and robust user management.
The application features real-time communication via Socket.IO, beautiful UI components, authentication, emoji support, and infinite scrolling.

While this repository contains the frontend codebase, all backend and socket server functionalities are handled by a separate repository:

👉 **Backend repository:** [https://github.com/oomeryuce/chat-app-api](https://github.com/oomeryuce/chat-app-api)

---

## Table of Contents

* [Features](#features)
* [Installation](#installation)
* [Development](#development)
* [Configuration](#configuration)
* [Scripts](#scripts)
* [Main Packages Used](#main-packages-used)
* [License](#license)
* [Contribution & Support](#contribution--support)

---

## Features

* **Nuxt.js (Vue.js) framework**
* **Real-time chat** with Socket.IO
* **Authentication** with @nuxtjs/auth-next
* **API communication** with @nuxtjs/axios
* **Modern UI** powered by Vuesax and Boxicons
* **Emoji picker** integration
* **Infinite chat message scrolling**
* **Responsive and mobile-friendly design**
* **Google Fonts & Dark mode**
* **Lottie animations**
* **Date/time formatting with Moment.js**

---

## Installation

### 1. Clone the Repository

```bash
git clone oomeryuce/chat-app-web
cd chat-app-web
```

### 2. Install Dependencies

```bash
npm install
```

---

## Development

### Start the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run start
```

### Generate Static Files

```bash
npm run generate
```

---

## Configuration

* **Environment Variables:**

  * You can configure API base URLs and authentication endpoints via `.env` or `nuxt.config.js`.
  * Make sure to set the backend API base URL to match your Laravel backend server.

* **Socket.IO:**

  * Socket connections are managed with `socket.io-client`.
  * Adjust the socket endpoint in your configuration if the backend server address changes.

* **Authentication:**

  * Handles login, registration, and session management with `@nuxtjs/auth-next`.

---

## Scripts

* `npm run dev` – Start the development server
* `npm run build` – Build for production
* `npm run start` – Start the production server
* `npm run generate` – Generate static files

---

## Main Packages Used

* **Core Framework**

  * `nuxt`
  * `vue`
* **UI & UX**

  * `vuesax`
  * `boxicons`
  * `vue-emoji-picker`
  * `vue-lottie`
  * `@nuxtjs/google-fonts`
  * `@nuxtjs/tailwindcss`
  * `tailwindcss-dark-mode`
* **Real-time & Data**

  * `socket.io-client`
  * `@nuxtjs/axios`
  * `@nuxtjs/auth-next`
  * `@nuxtjs/moment`
  * `vue-infinite-loading`
* **Utilities & Tooling**

  * `eslint`, `prettier`, `babel-eslint`, `postcss`, `sass`, etc.

---

## License

This project is licensed under the MIT License.

---

## Contribution & Support

Feel free to [open an issue](https://github.com/oomeryuce/chat-app-web/issues) or submit a pull request.

For questions, reach out at: oomeryuce@gmail.com
