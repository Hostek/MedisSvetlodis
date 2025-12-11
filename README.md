# MedisSvetlodis

MedisSvetlodis, app for chatting with your friends!

## Structure

| Codebase         |      Description      |
| :--------------- | :-------------------: |
| [client](client) |   Next.js frontend    |
| [server](server) | Graphql Apollo Server |
| [shared](shared) |    Shared ts code     |

## How to run locally?

First, install all dependencies with:
```sh
yarn install
```

### Setup `shared`

In `/shared` directory there is stuff that is used both on `client` and `server`.

We need to compile this first before running `client` or `server`.
```sh
yarn watch
``` 

### Setup `client`

In `/client` directory copy `.env.example` file into `.env.local` file:
```sh
cp .env.example .env.local
```

Now, fill the needed info in the `.env.local` file. For local development use these:
```sh
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
```

`NEXTAUTH_SECRET` and `OAUTH_PROOF_SECRET` variables can be generated using this command: (make sure that both variables are different, so run this command twice)
```sh
openssl rand -base64 32
```

Now we can setup OAuth providers (optional step)

I will show only Github here, but Gitlab is almost the same.

Go to this link: https://github.com/settings/developers and then OAuth Apps section.
Create new OAuth App. Application name can be any. 
For local development field `Homepage URL` should be set to `http://localhost:3000`.
For local development field `Authorization callback URL` should be set to `http://localhost:3000/api/auth/callback/github`

Then fill these env vars:
```sh
GITHUB_SECRET=
GITHUB_ID=
```

`GITHUB_ID` is **Client ID**. `GITHUB_SECRET` is **Client secret** – generate new 
one for the project. Make sure to copy it, because you can see it only one time.

Now, run the project!
```sh
yarn dev
```

Should be running on `http://localhost:3000/`.

### Setup `server`

In `/server` directory copy `.env.example` file into `.env` file:
```sh
cp .env.example .env
```

Make sure to have PostgreSQL and Redis running in the background.

For development use these env vars:
```sh
PORT=3001
CLIENT_URL=http://localhost:3000/
COOKIE_DOMAIN=localhost
REDIS_URL=redis://localhost:6379
```

Fill in your DB data: (for development it can be these; make sure that there exists DB with name `medissvetlodis`)
```sh
DB_USER=your_db_username
DB_PASS=your_db_password
DB_NAME=medissvetlodis
DB_PORT=5432
DB_HOST=localhost
```

**Important!**: `OAUTH_PROOF_SECRET` variable should be the same as in `/client/.env.local`!

You can generate `COOKIE_SESSION_SECRET` and `PRIVATE_SERVER_KEY` with this: (they should be different values, so run below command multiple times)
```sh
openssl rand -base64 32
```

`HOAX_USER_PASSWORD` you can set to `12345678` or `qwertyuiop`. It's used only in dev. So the hoax users would all have this password.

Now compile the server:
```sh
yarn watch
```

Run migrations (to setup db tables)
```sh
./generate-migration.sh -r 
```

And then start the server!
```sh
yarn start
```
