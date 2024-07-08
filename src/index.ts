console.log(`✅ CONSOLE LOG INDEX ✅`);
import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, {Request,Response} from "express";
import path from "path";
import { Storage } from '@google-cloud/storage';
import {config as dotenvConfig} from 'dotenv';
import { DB_OPS } from "./utils/db";
import multer from 'multer';

dotenvConfig()

const app = express();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
app.set('view engine','ejs');
app.set('views',path.join(__dirname, '../views'));
app.use(cors({credentials:true}));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/',async(req:Request,res:Response)=>{
    const jokeResult = await (await fetch('https://api.chucknorris.io/jokes/random')).json();
    res.render('index',{content:jokeResult.value});
})
app.get('/login',async(req:Request,res:Response)=>{

    res.render('login');
})
app.get('/signup',async(req:Request,res:Response)=>{
  
    res.render('signup');
})
app.get('/profile/:id',async(req:Request,res:Response)=>{
    const token = req.params.id;

    res.render('profile',{token});
})
app.post('/uploadAvatar',upload.single('image'), async(req:Request,res:Response)=>{
    try {
        const storageClient = new Storage();
        const bucketName = 'avatars24';
        // const email = req.email;
        // const uid = req.uid;
        // console.log(`USERS EMAIL ${email} UID: ${uid}`)

        const file = req.file;
        if (!file || !bucketName) {
          throw new Error('No file uploaded or bucket name.');
        }
    

        const fileStream = new Uint8Array(file.buffer); 
        
        const fileMetadata = await storageClient
        .bucket(bucketName)
        .file(file.originalname)
        .save(fileStream);
      
        res.json({status:true,msg:`Upload SUceessful`,imageURL:`https://storage.googleapis.com/${bucketName}/${file.originalname}`})

      } catch (error) {
        console.log(error);
        res.json({status:false,msg:`ERROR ${error}`});
      }
})
app.post('/ping',async(req:Request,res:Response)=>{
    try {
        const dbResult = await DB_OPS.read('users','testUser');
        if(!dbResult){throw new Error(`Error getting from DB`)}

        res.json({status:true,msg:`SUCCESS 🟢: ${JSON.stringify(dbResult,null,2)}`})
    } catch (error) {
        console.log(`Error: ${error}`)
        res.json({status:false,msg:` ⭕ Error: ${error}`})
    }
})
const PORT = process.env.PORT || 8080;
app.listen(PORT,()=>{
    console.log(`Server LISTENING on port : ${PORT}`)
})

