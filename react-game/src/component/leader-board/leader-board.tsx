import LeaderBoardModel from "../model/leaderboard.model";
import { useEffect, useState } from 'react';
import IMG_LOGO from "../../assets/images/logo.png";
import IMG_CITY from "../../assets/images/city.png";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import { db } from "../services/api-service";
import UtilityService from "../services/utility";
import './leader-board.css';
const LeaderBoardComponent = () => {
    let navigate = useNavigate();
    const [leaderScore, setLeaderScore] = useState<LeaderBoardModel[]>([])

    useEffect(() => {
        readData();
    }, [])

    const readData = async () => {

        const scoreRef = collection(db, "game-flappy-work");
        const q = query(scoreRef, orderBy("score", "desc"), limit(10));
        const leaderSc: any = [];
        const querySnapshot = await getDocs(q);
        let leaderSC: LeaderBoardModel[] = [];
        querySnapshot.forEach((doc) => {
            leaderSc.push(doc.data());
            const objectSC: LeaderBoardModel = {
                isWinner: doc.data().isWinner,
                name: doc.data().name,
                score: doc.data().score,
                timeStamp: doc.data().timeStamp
            }
            leaderSC.push(objectSC)
        });
        setLeaderScore(leaderSC);
    }

    const backHome = () => {

        UtilityService().clickSendEvent('Click', 'Leaderboard', 'Back Home');
        navigate('/');
    }
    return (
        <>
            <div className='lb-control'>
                <img src={IMG_LOGO} className="img-logo"></img>
                <h1 className='text-header-leader'>LEADERBOARD</h1>
                <div className='grid-control'>
                    <div className='grid-leader' >
                        <span className='grid-item leader-board-text'>Rank</span>
                        <span className='grid-item leader-board-text' >Name</span>
                        <span className='grid-item leader-board-text' >Score</span>
                    </div>
                    {
                        leaderScore.map((element: LeaderBoardModel, index: number) => {

                            return (
                                <div className='grid-leader' key={index}>
                                    <span className='grid-item leader-board-text'>{index + 1}</span>
                                    <span className='grid-item leader-board-text' >{element.name}</span>
                                    <span className='grid-item leader-board-text' >{element.score.toLocaleString()}</span>
                                </div>
                            )
                        })
                    }
                </div>
                <button className='button-home' onClick={backHome}>Home</button>
                <img src={IMG_CITY} className="img-city"></img>
            </div>
        </>
    );
}

export default LeaderBoardComponent;