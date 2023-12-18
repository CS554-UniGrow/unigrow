This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Techonologies used :
Next Js for the application
Upstash for messaging
Pusher for notification
MongoDb as the primary storage
Next Auth with Google Provider
CRON scheduler

## Getting Started

set the following env variables in .env of the root folder of the repo
all the values must be in quotes

these come from Pusher :
NEXT_PUBLIC_PUSHER_APP_ID
NEXT_PUBLIC_PUSHER_APP_SECRET
NEXT_PUBLIC_PUSHER_APP_KEY
NEXT_PUBLIC_PUSHER_APP_TLS="true"

setup an account with www.pusher.com and then create an account
create a new channels project with the closest region to you
after creation open the project and go to app keys
set the app keys as above
make a note of the cluser string as we need to set that value for the cluster attrinute in ./lib/pusher.ts

these Come from Google AUth provider :
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

create an account at https://console.cloud.google.com/apis/dashboard
then click on credentails
click on create credentials
click on help me choose
select service management api
select user data
click on add remove scopes
select the top 3 available i.e userinfo.email userinfo.profile and openid
save and continue
then add the project name
add authorized javascript origins as
server name :
(server link)
http://localhost:3000

authorized redirect uri as
(server link)/api/auth/callback/google
http://localhost:3000/api/auth/callback/google

compelete the steps ahead
you will then set the
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET

This wil be set to the following :
NEXT_PUBLIC_CANVAS_BASE_URL="https://sit.instructure.com/api/v1/"

these comes from UPSTASH :
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN

create an account on upstash
create a new database
set name
set region
set tls enabled
then scroll down to rest API and click .env
get the credentials from there and set it to
NEXT_PUBLIC_UPSTASH_REDIS_REST_URL
NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN

This will be based on the server you run or deploy on :
NEXTAUTH_URL="http://localhost:3000"
Change it depending on which server the code will run on

generate a md5 using a secret text https://www.md5hashgenerator.com/ and store the value to the following :
you can either have the same value or 3 different values : "mongodb://localhost:27017"
NEXT_API_SEED_SECRET
NEXT_PUBLIC_HASHING_KEY
NEXTAUTH_SECRET
CRON_SECRET

Setup an account with MongoDB and create a cluster with a name :
mongodb uri comes from the mongo atlas setup
for local testing you can set it to whatever is your local mongo uri ( usually its )
MONGO_DB_NAME="UniGrow"
MONGODB_URI

These comes from Firebase :
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

Firebase Storage

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
9. now in the firebase console go to Storage and set the rules as follows :
   rules_version = '2';

service firebase.storage {
match /b/{bucket}/o {
match /{allPaths=\*\*} {
allow read: if true; // allow all reads

      // Allow write only if the user is an admin
      allow write: if isAdmin(request.resource.metadata.x_api_key);
    }

}
}

function isAdmin(apiKey) {
return apiKey == "NEXT_API_SEED_SECRET value ";
// the value will be hardcoded based on the env file
// Replace with your actual admin check logic if needed
}

set the env variable NEXT_API_SEED_SECRET to the generated hash
now hit the route /api/mongo/ with a get request and set the Authorization Header with Bearer token as the hash value
i.e Authorization : 'Bearer hashed_secret_value'

then do an npm install
you can run the application in the following modes :
development mode : npm run dev
production mode : npm run prod:deploy
production mode from scratch : npm run prod:install:deploy
create production image : npm run build
run production image : npm run start

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

live demos :
https://unigrow-a732c2389a03.herokuapp.com/
https://unigrow.vercel.app/
