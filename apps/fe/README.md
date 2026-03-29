This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## How to Remove TailwindCSS from the Project

If you do not wish to use TailwindCSS in this project, follow these steps:

1. **Uninstall Tailwind and related packages:**

   In your project root, run:

   ```bash
   npm uninstall tailwindcss postcss autoprefixer
   ```

   Then in the monorepo root, run:

   ```bash
   npm uninstall eslint-plugin-better-tailwindcss
   ```

2. **Delete configuration files:**

   Remove the files `postcss.config.js` (or `.mjs`), remove `betterTailwindcss` entries from config in `eslint.config.js` and any other related files from your project root.

3. **Remove Tailwind style imports:**

   Open `src/app/globals.css` and delete these lines:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   @theme {
     --*: initial;
   }
   ```

4. **(Optional) Remove Tailwind utility classes from components:**

   If you have already used Tailwind utility classes in your components, replace them with your own styles or another CSS framework of your choice.

After completing these steps, TailwindCSS will be fully removed from your project.
