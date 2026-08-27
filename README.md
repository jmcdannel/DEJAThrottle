> [!IMPORTANT]
> **This project has moved.** Active development of DEJA.js and the Track & Trestle model
> railroad platform now happens in private repositories under
> [**Track and Trestle Technology, LLC**](https://github.com/trackandtrestle).
> This repository stays public as a historical snapshot and is no longer maintained.
>
> **Current product, docs, and downloads → [dejajs.com](https://dejajs.com)**

# 🚂 DEJA Throttle

**Vue 3 web app for driving DCC model locomotives from any browser.**

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-DD2C00?style=for-the-badge&logo=firebase&logoColor=white" />
</p>

DEJA Throttle turns a phone, tablet, or laptop into a wireless DCC throttle for a
[DCC-EX EX-CommandStation](https://dcc-ex.com/ex-commandstation/index.html) — no app store,
no proprietary hardware.

## ✨ What it does

- 🎚️ **Speed, direction, and function control** for multiple locomotives
- 🔌 **Three connection modes** — DEJA Server (wireless, recommended), direct USB via the
  [Web Serial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API), or a
  built-in **emulator** for demoing without hardware
- 📲 **Installable PWA** with dark mode and oversized controls designed for panic stops
- ⚡ **Realtime sync** — commands round-trip through Firebase RTDB so several throttles
  can share one command station

## 🏗️ How it works

```
Browser (Vue 3)  ──▶  Firebase RTDB  ──▶  DEJA Server (Node)  ──USB serial──▶  DCC-EX  ──▶  Track
       └────────────── or Web Serial direct to DCC-EX ──────────────┘
```

The throttle never talks to the track directly. It writes structured commands to Firebase;
a Node.js server sitting next to the command station subscribes, translates them into
[DCC-EX native commands](https://dcc-ex.com/reference/software/command-summary-consolidated.html),
and writes them over USB serial at 115200 baud.

## ⚙️ Tech stack

| Layer | Technologies |
|-------|-------------|
| **UI** | Vue 3 (Composition API), Vuestic UI, Tailwind CSS |
| **State / data** | Pinia, VueFire, Firebase Realtime Database |
| **Build** | Vite, TypeScript, Vitest |
| **Hardware I/O** | Web Serial API, DCC-EX native command protocol |

## 🧑‍💻 Local development

```bash
pnpm install
pnpm --filter=deja-throttle dev
```

> Requires Node.js 20+ and pnpm 9+. Firebase credentials go in `.env` — see the
> [current docs](https://dejajs.com/docs) for the supported setup.

## 🧭 Where this fits

This repo is one step in a long-running line of model railroad control software:

| Era | Project | What changed |
|-----|---------|--------------|
| 2020 | [`train-control`](https://github.com/jmcdannel/train-control) | First React throttle, JMRI + Arduino over HTTP |
| 2021 | [`dctc`](https://github.com/jmcdannel/dctc) | Standalone Arduino DC controller (no computer required) |
| 2022–23 | [`layout-conductor-*`](https://github.com/jmcdannel?tab=repositories&q=layout-conductor) | Split into app + API; Python, Node, and Deno backends explored |
| 2024 | [`Track-and-Trestle-Technology-Suite`](https://github.com/jmcdannel/Track-and-Trestle-Technology-Suite) | MQTT-based monorepo: dispatcher, throttle, dashboard, action API |
| 2024–25 | [`DEJA.js`](https://github.com/jmcdannel/DEJA.js) | TypeScript/Turborepo rewrite, Firebase realtime backbone |
| 2025– | **[dejajs.com](https://dejajs.com)** (private) | Commercial cloud platform for DCC-EX |

---

<sub>Built by [Josh McDannel](https://github.com/jmcdannel) · [dejajs.com](https://dejajs.com) · [LinkedIn](https://www.linkedin.com/in/jmcdannel)</sub>
