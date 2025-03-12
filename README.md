This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. NPM Install
1. Set up Prisma
    1. Prisma instance: Create new or join existing
    1. Credentials
    1. Set up new instance
1. Run locally

### Get environment variables

Run the following command:

```bash
vercel env pull
```

Rename `.env.local` to `.env`

### NPM Install
Run `npm i` (or equivalent command in your preferred yarn/pnpm/bun client)

### Set up Prisma
#### Prisma instance
Join an existing Prisma workspace by getting an invite from a current member.

Or, create a new instance. Go to https://www.prisma.io/ and sign up. A "Personal workspace" will be created by default. Create a new Prisma Postgres instance.

#### Credentials
Navigate to `Database` (LH menu) and click `Setup` (main panel, middle tab)
Click `Generate Credentials`.
Save the result in a `.env` file in the project root.
If joining an existing instance, skip to running locally.

#### Set up new instance
Push the database schema: `npx prisma db push`
Seed the database: `npm run seed`

#### Interact with Prisma data
Run `npx prisma studio`. This will start a local DB frontend for CRUD.

### Run locally
`npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

