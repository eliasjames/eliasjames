## Overview

This is a quick start template to get a best-practice web app up and running.

Based on:

- Next.js, the React Framework for the Web
- NextAuth.js, a complete open source authentication solution.
- [https://github.com/nextauthjs/next-auth-example.git](next-auth-example), an implementation of NextAuth
  - ISC License copyright Balázs Orbán
  - other contributors: Iain Collins, Nico Domino, Lluis Agusti, Thang Huu Vu

## Security Disclaimer

Security is a deep subject and critically important. This project is forked from NextAuth's example code, and every attempt has been made to maintain or increase security.

However, it is _strongly recommended_ to have a penetration test performed by an experienced security firm before going live with any app forked from this code.

## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/gillbreath/next-auth-launchpad
cd next-auth-launchpad
npm install
```

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local or .env

- Fill in the details for the env vars
- note, ".local" is a Next.js convention
- don't check these files in - both of those file names are in .gitignore to help

### 3. Run tests and start the application

This command does both:

```
npm run test
```

### 5. Preparing for Production

Follow the [Deployment documentation](https://authjs.dev/getting-started/deployment)

## License

ISC
