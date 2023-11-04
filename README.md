This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

to seed the project's mongodb do the following
hit the api route http://localhost:3000/api/mongo/

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Firebase Setup

1. Navigate to [Firebase Console](https://firebase.google.com/ "Firebase") and sign in.
2. Click on **Add Project** and enter project name as CS554-Unigrow. Click on **Continue**.
3. On the next screen you can choose if you want to enable analytics for your project.
4. Click on **Create project** .
5. Next, you need to create a web app. On your project homepage click on the web icon to create your web app:
   ![Select Web](https://www.freecodecamp.org/news/content/images/2023/02/Screenshot-2023-02-15-at-5.40.33-PM.png "Create a firebase Web App.")
6. Give your web app a name and click **Register app**.
7. Copy the configuration file we are going to need it later. Click next until you are done.
8. Create a `.env` file in the root directory of your Next.js project and add your Firebase configuration files (the ones you copied earlier). It should look like this:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=analytic-id
   ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
