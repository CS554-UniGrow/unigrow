# Project Title

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Technologies Used

- Next Js for the application
- Upstash for messaging
- Pusher for notification
- MongoDB as the primary storage
- Next Auth with Google Provider
- CRON scheduler

## Live Demos

- [Heroku Demo](https://unigrow-a732c2389a03.herokuapp.com/)
- [Vercel Demo](https://unigrow.vercel.app/)

## Getting Started

Set the following environment variables in the `.env` file at the root folder of the repository. Ensure all values are enclosed in quotes.

### Pusher Environment Variables

These come from Pusher:

- NEXT_PUBLIC_PUSHER_APP_ID
- NEXT_PUBLIC_PUSHER_APP_SECRET
- NEXT_PUBLIC_PUSHER_APP_KEY
- NEXT_PUBLIC_PUSHER_APP_TLS="true"

1. Setup an account with [Pusher](https://www.pusher.com/).
2. Create a new channels project with the closest region to you.
3. Obtain app keys and set them as specified.
4. Note the cluster string from the project and set it for the cluster attribute in `./lib/pusher.ts`.

### Google Auth Provider Environment Variables

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

1. Create an account at [Google Cloud Console](https://console.cloud.google.com/apis/dashboard).
2. Navigate to credentials, create credentials, and choose service management API.
3. Select user data, add required scopes, and set authorized origins and redirect URIs.
4. Obtain and set the client ID and client secret.

### Upstash Environment Variables

- NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
- NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN

1. Create an account on Upstash.
2. Create a new database, set details, and obtain credentials from the REST API section.
3. Set the obtained values for Upstash environment variables.

### Other Environment Variables

- NEXT_PUBLIC_CANVAS_BASE_URL
- NEXTAUTH_URL
- NEXT_API_SEED_SECRET
- NEXT_PUBLIC_HASHING_KEY
- NEXTAUTH_SECRET
- CRON_SECRET
- MONGO_DB_NAME
- MONGODB_URI

1. Adjust the values based on your setup.
2. Generate an MD5 hash for specified secrets.

## Firebase Environment Variables

These come from Firebase:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_DATABASE_URL
- NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

## Firebase Setup

Follow the steps to set up Firebase and configure your Next.js project.

1. Navigate to [Firebase Console](https://firebase.google.com/).
2. Add a new project and create a web app.
3. Copy the configuration to your `.env` file.
4. Set the Firebase environment variables.

## Firebase Storage Rules

1. Set the storage rules in the Firebase console.

## Application Setup and Run

1. Run `npm install`.
2. Run the application in different modes:
   - Development mode: `npm run dev`
   - Production mode: `npm run prod:deploy`
   - Production mode from scratch: `npm run prod:install:deploy`
   - Create production image: `npm run build`
   - Run production image: `npm run start`

Open http://localhost:3000 in your browser to see the result.

## Reseed MongoDB Data

To reseed the MongoDB database with fresh data, you can use the `/api/mongo` route. Follow the steps below to perform the reseeding process:

1. **Route: `/api/mongo/`**

   - This endpoint is specifically designed for reseeding the MongoDB database.

2. **Authorization:**

   - Ensure that you include a valid bearer token in the Authorization header when making requests to this endpoint. Use the Next API seed secret specified for seeding.

     Example:

     ```plaintext
     Authorization: Bearer $NEXT_API_SEED_SECRET
     ```

3. **How to Reseed Data:**

   - Make a `POST` request to this endpoint to trigger the reseeding process.

     Example:

     ```plaintext
     GET /api/mongo/
     ```

4. **Response:**

   - The endpoint will respond with a message indicating the success of the reseeding process.

     Example:

     ```json
     {
       "message": "MongoDB data reseeded successfully"
     }
     ```

5. **Note:**

   - Ensure that you have the necessary permissions and a valid Next API seed secret in your environment variables.

Remember to replace placeholders like `$NEXT_API_SEED_SECRET` with the actual environment variable or secret used for seeding in your project. Adjust the language and structure as needed.
