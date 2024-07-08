import {Firestore} from '@google-cloud/firestore';
import admin from'firebase-admin';
import { Request, Response } from 'express';
import { NextFunction } from 'express';
import { CustomRequest } from './consts';
const firestore = new Firestore();
export const DB_OPS = {
    create:async(coll:string,doc:string,data:any)=>{
        try {
      
            const documentRef = firestore.doc(`${coll}/${doc}`);
            await documentRef.set(data);
            return true;
        } catch (error) {
            return false;
        }
    },
    read:async(coll:string,doc:string)=>{
        try {
     
            const documentRef = firestore.doc(`${coll}/${doc}`);
            const docSnapshot = await documentRef.get();
            if (!docSnapshot.exists) {throw new Error(`Doc Does not exist`);}
            return docSnapshot.data();
        } catch (error) {
            return null;
        }
    },
    update:async(coll:string,doc:string,data:any)=>{
        try {
            console.log(`PRE DB`);
      
            const docRef = firestore.collection(coll).doc(doc);
            await docRef.update(data);
            return true;
        } catch (error) {
            console.log(`UPDATE Er:${error}`);

            return false;
        }
    },
    delete:async(coll:string,doc:string)=>{
        try {
    
            const docRef = firestore.collection(coll).doc(doc);
            await docRef.delete();
            return true;
        } catch (error) {
            console.log(`DELETE Er:${error}`);
            return false;
        }
    }
}
export const adminApp = async():Promise<admin.app.App>=>{
    if(admin.apps.length > 0){
        return admin.app()
    }else{
        const serviceAccount = './gcred.json'; 
        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
}
export const checkToken = async(token:string):Promise<string | false>=>{
    try {
        const fbApp = await adminApp();
        const decodedToken = await fbApp.auth().verifyIdToken(token);
        if(decodedToken){
            console.log(`GOOD TOKEN`)
            return decodedToken.uid;
        }else{
            throw new Error(`Token no good`)
        }
       
    } catch (error) {
        console.log(`Error checking token ${error}`);
        return false;
    }
}
export const authenticator = async(req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers.authorization; 
    const token = authHeader && authHeader.split(' ')[1];
  

  
    try {
        if (!token) {
           throw new Error(`Error getting token`)
          }
        const aApp = await adminApp();
        const decodedToken = await aApp.auth().verifyIdToken(token);
        const uid = decodedToken.uid; 
        
        (req as CustomRequest).uid = uid;
        (req as CustomRequest).idToken = token; 
        (req as CustomRequest).email = decodedToken.email;
   
        next();

    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}
