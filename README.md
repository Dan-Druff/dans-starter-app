# dans-starter-app
Powerful Bare Bones Full Stack App Template with Authentication, Database, File Storage, Payment Processing and Deployment for Cheap $$.

Built with Express, Typescript, GCloud, Stripe.

`npm install body-parser compression cookie-parser cors dotenv ejs express firebase-admin multer @google-cloud/firestore @google-cloud/storage`

`npm install -D @types/body-parser @types/compression @types/cookie-parser @types/cors @types/express @types/node nodemon ts-node typescript @types/multer`

# Need gcloud cli

# .env
```env
PORT=3000
SERVER_URL=http://localhost:3000
# SERVER_URL=''
```
# app.yaml
```ymlg
runtime: nodejs22
```

# tsconfig
```json
{
    "compilerOptions": {
      "target": "ES2020",
      "module": "NodeNext",
      "outDir": "./dist",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "noImplicitAny": true,
      "skipLibCheck": true,
      "rootDir": "./src",
      "baseUrl": ".",
      "sourceMap": true,
      "paths": {
        "*": ["src/*"]
      }
    },
    "include": [
      "src/**/*.ts"
    ],
    "exclude": ["node_modules", "dist"]
  }
```
  # package.json
```json
    "scripts": {
    "build": "tsc",
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node dist/index.js",
    "dev": "nodemon",
    "deploy": "gcloud app deploy"
  }
  ```

  # nodemon.json
  ```json
  {
    "watch":["src","views"],
    "ext":".ts,.js,.ejs",
    "exec":"ts-node ./src/index.ts"

}
```

# gcred.json
```json
{"whatever":"serviceaccountdata"}
```

# src/router/ping.ts
```typescript
import express from "express";
import { promises as fs } from "fs";
const pingRouter = express.Router();
pingRouter
  .route("/")
  .get(async (req: express.Request, res: express.Response) => {
    return res.json({ payload: "HELLO WORLD" });
  })
  .post(async (req: express.Request, res: express.Response) => {
    try {
      return res.json({ status: true, payload: `SUCCESS POST` });
    } catch (error) {
      console.log(`Error again ${error}`);
      return res.json({ status: false, payload: `Error again ${error}` });
    }
  })
  .put(async (req: express.Request, res: express.Response) => {
    return res.send(`PING PUT`);
  });
export default pingRouter;
```


## When it works local, app.yaml added, gcloud project is created; then initialize code with project:
`gcloud init`

## Deploy
`gcloud app deploy`

## Test
`gcloud app browse`

enable gcloud firestore in project

``` javascript   
    const response = await fetch("/uploadAvatar", {
              
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
```

create credentials

datastore native mode

enable indentity toolkit api

enable indeintity platform

create new Bucket

add permissions

gcloud storage / multer
