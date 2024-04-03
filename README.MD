# Collaborative Note App

Welcome to the Collaborative Note App repository! This is an open-source project aimed at providing a self-hosted collaborative note-taking experience. You can easily set it up on your own server or try it out instantly using the provided link.

## Try it out!

Visit [https://note.toolstack.run](https://note.toolstack.run) and add your note ID after the slash to get started. It's that simple! You can also easily lock your notes with a password for added security.

## Features

- **Real-time Collaboration:** Powered by [PartyKit](https://partykit.io/), enabling seamless collaboration on your notes.
- **Self-hosted:** You have full control over your data by hosting it on your own server.
- **Password Protection:** Secure your notes with passwords for privacy.
- **React + Vite:** Built with modern web technologies for optimal performance.

## How it Works

The notes in this project are saved using PartyKit's infrastructure, providing globally distributed, stateful, on-demand, and programmable web servers. Each note instance (referred to as a "Party") is backed by a Cloudflare Durable Object, ensuring reliability and scalability.

PartyKit servers are fully programmable in TypeScript, JavaScript, and can even be extended with WebAssembly modules for advanced functionality. Additionally, PartyKit allows for on-demand creation of instances, ensuring minimal start-up time and efficient resource utilization.

## How is it Reliable?

- **Stateful Architecture:** Each note instance maintains its state, ensuring consistency and reliability.
- **Globally Distributed:** Leveraging Cloudflare's edge network, notes are hosted in hundreds of data centers globally, providing reliability and low-latency access.

## Technologies Used

- React
- Vite
- PartyKit
- Tiptap Editor

## Contributions

Contributions to this project are welcome! Whether it's bug fixes, feature enhancements, or documentation improvements, feel free to open an issue or submit a pull request.

## Demo

Check out the live demo [here](https://note.toolstack.run).

## Credits

- Project Creator: [@amirsalimiiii](https://twitter.com/amirsalimiiii/)
- PartyKit: [https://partykit.io/](https://partykit.io/)
- Tiptap Editor: [https://tiptap.dev/](https://tiptap.dev/)

## Twitter Announcement

Check out the Twitter announcement [here](https://twitter.com/amirsalimiiii/status/1774899652598350069).

---

Feel free to explore the codebase, contribute, and create your own collaborative note-taking experience!

## Todos

- Add [Pocketbase.io](https://pocketbase.io/) provider for storage backup for notes.
- Add AI capabilities.
