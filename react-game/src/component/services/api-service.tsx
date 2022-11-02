import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import config from '../../config';
const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);
export default function ApiServices() {


    return {
        async writeUserData (score: number, isWinner: boolean, name: string){
            console.log(score)
            try {
              const docRef = await addDoc(collection(db, "game-flappy-work"), {
                score: score,
                isWinner: isWinner,
                name: name,
                timeStamp: new Date().toISOString()
              });
              console.log("Document written with ID: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
          }
        }
    }