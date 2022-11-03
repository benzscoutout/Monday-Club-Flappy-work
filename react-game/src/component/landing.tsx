import React, { useEffect, useState } from 'react';
import '../App.css';
import './landing.css';
import '../assets/js/fastclick';
import { attach2 } from '../assets/js/fastclick';
import config from '../config';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, orderBy, query } from 'firebase/firestore';
import ApiServices from './services/api-service';
import { useNavigate } from "react-router-dom";
import UtilityService from './services/utility';
const app = initializeApp(config.firebaseConfig);
export const db = getFirestore(app);
const LandingComponent = () => {
    let navigate = useNavigate();
    const [isName, setIsName] = useState(false);
    const [name, setName] = useState('');
    const [isSaveScore, setSaveScore] = useState(false);
    const [isSubmitting, setSaveSubmitting] = useState(false);
    const [isChangeSpeed, setChangeSpeed] = useState(false);
    const canvasRef = React.useRef(null);
    var width: any, height: any, birdPos: any;
    var sky: any, land: any, bird: any, pipe: any, pipeUp: any, pipeDown: any, scoreBoard: any, ready: any, splash: any;
    var dist: any, birdY: any, birdF: any, birdN: any, birdV: any;
    var animation: any, death: any, deathAnim: any;
    var pipes: any = [], pipesDir: any = [], pipeSt: any, pipeNumber: any;
    var score: any;
    var dropSpeed: any;
    var flashlight_switch = false, hidden_switch = false;
    var mode: any, delta: any;
    var wechat = false;
    var playend: any = false;
    var playdata: any = [];
    var wxData;
    const [maxScore, setMaxScore] = useState(0);
    const [isDeath, setDeath] = useState(false);
    const [ctx, setContext] = React.useState<CanvasRenderingContext2D | null>(null);
    const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
    useEffect(() => {
        // Infinite loop!b
        if (canvasRef.current) {
            console.log(canvasRef.current)
            var canvas2 = canvasRef.current as HTMLCanvasElement;
            setCanvas(canvas2);
            const ctx2 = canvas2.getContext('2d');
            setContext(ctx2);
        }

        if (canvas && ctx) {
            console.log('ready to render');
            mode = 2;
            score = 0;
            playdata = [0, 0];
            setMaxScore(0);
            dropSpeed = 0.3;
            mode = 2;
            delta = 100;
            initCanvas();
            window.onresize = function () {
                if (ctx && canvas2) {
                    canvas2.width = width = window.innerWidth;
                    canvas2.height = height = window.innerHeight;
                    drawCanvas();
                }
            }
        }
    }, [canvas, ctx]);

    const clearCanvas = () => {
        if (ctx) {
            ctx.fillStyle = '#F9F5EB';
            ctx.fillRect(0, 0, width, height);
        }
    }


    var loadImages = function () {
        var imgNumber = 9, imgComplete = 0;
        var onImgLoad = function () {
            imgComplete++;
            if (imgComplete == imgNumber) {
                death = 1;
                dist = 0;
                birdY = (height - 112) / 2;
                birdF = 0;
                birdN = 0;
                birdV = 0;
                birdPos = width * 0.35;
                score = 0;
                pipeSt = 0;
                pipeNumber = 10;
                pipes = [];
                pipesDir = [];
                for (var i = 0; i < 10; ++i) {
                    pipes.push(Math.floor(Math.random() * (height - 300 - delta) + 10));
                    pipesDir.push((Math.random() > 0.5));
                }
                drawCanvas();
            }
        }

        sky = new Image();
        sky.src = 'images/sky.png';
        sky.onload = onImgLoad;

        land = new Image();
        land.src = 'images/land.png';
        land.onload = onImgLoad;

        bird = new Image();
        bird.src = 'images/bird.png';
        bird.onload = onImgLoad;

        pipe = new Image();
        pipe.src = 'images/pipe.png';
        pipe.onload = onImgLoad;

        pipeUp = new Image();
        pipeUp.src = 'images/pipe-up.png';
        pipeUp.onload = onImgLoad;

        pipeDown = new Image();
        pipeDown.src = 'images/pipe-down.png';
        pipeDown.onload = onImgLoad;

        scoreBoard = new Image();
        scoreBoard.src = 'images/scoreboard.png';
        scoreBoard.onload = onImgLoad;

        ready = new Image();
        ready.src = 'images/replay.png';
        ready.onload = onImgLoad;

        splash = new Image();
        splash.src = 'images/splash.png';
        splash.onload = onImgLoad;
    }

    function is_touch_device() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }

    const initCanvas = () => {
        if (ctx && canvas) {
            console.log('init canvas')
            canvas.width = width = window.innerWidth;
            canvas.height = height = window.innerHeight;
            if (is_touch_device()) {
                canvas.addEventListener("touchend", function (e: any) { e.preventDefault(); }, false);
                canvas.addEventListener("touchstart", function (e: any) {
                    jump();
                    e.preventDefault();
                }, false);
            }
            else
                canvas.onmousedown = jump;
            // window.onkeydown = jump;
            attach2(canvas);
            loadImages();
        }

    }



    var deathAnimation = function () {
        if (ctx && canvas) {
            if (splash) {
                ctx.drawImage(splash, width / 2 - 94, height / 2 - 54);
                splash = undefined;
            }
            else {
                ctx.drawImage(scoreBoard, width / 2 - 118, height / 2 - 54);
                playend = true;
                playdata = [mode, score];
                setDeath(true);
            }
            ctx.drawImage(ready, width / 2 - 57, height / 2 + 10);
            const maxScore2 = Math.max(maxScore, score);
            setMaxScore(maxScore2);



        }
    }

    var drawSky = function () {
        if (ctx && canvas) {
            var totWidth = 0;
            while (totWidth < width) {
                ctx.drawImage(sky, totWidth, height - 521);
                totWidth += sky.width;
            }
        }
    }

    var drawLand = function () {
        if (ctx && canvas) {
            var totWidth = -dist;
            while (totWidth < width) {
                ctx.drawImage(land, totWidth, height - 112);
                totWidth += land.width;
            }
            dist = dist + 2;
            var tmp = Math.floor(dist - width * 0.65) % 220;
            if (dist >= width * 0.65 && Math.abs(tmp) <= 1) {
                score++;
            }
        }
    }

    var drawPipe = function (x: any, y: any) {
        if (ctx && canvas) {
            ctx.drawImage(pipe, x, 0, pipe.width, y);
            ctx.drawImage(pipeDown, x, y);
            ctx.drawImage(pipe, x, y + 168 + delta, pipe.width, height - 112);
            ctx.drawImage(pipeUp, x, y + 144 + delta);
            if (x < birdPos + 32 && x + 50 > birdPos && (birdY < y + 22 || birdY + 22 > y + 144 + delta)) {
                clearInterval(animation);
                death = 1;
            }
            else if (x + 40 < 0) {
                pipeSt++;
                pipeNumber++;
                pipes.push(Math.floor(Math.random() * (height - 300 - delta) + 10));
                pipesDir.push((Math.random() > 0.5));
            }
        }

    }

    var drawBird = function () {
        if (ctx && canvas) {
            //	ctx.translate(width * 0.35 + 17, birdY + 12);
            //	var deg = -Math.atan(birdV / 2) / 3.14159;
            //	ctx.rotate(deg);
            ctx.drawImage(bird, 0, birdN * 24, bird.width, bird.height / 4, birdPos, birdY, bird.width, bird.height / 4);
            //	ctx.rotate(-deg);
            //	ctx.translate(-width * 0.35 - 17, -birdY - 12);
            birdF = (birdF + 1) % 6;
            if (birdF % 6 == 0)
                birdN = (birdN + 1) % 4;
            birdY -= birdV;
            birdV -= dropSpeed;
            if (birdY + 138 > height) {
                clearInterval(animation);
                death = 1;
            }
            if (death) {
                deathAnimation();

            }

        }
    }

    var drawScore = function () {
        if (ctx && canvas) {
            ctx.font = '20px "Press Start 2P"';
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#fff';
            ctx.fillStyle = '#000';
            var txt = "" + score;
            ctx.strokeText(txt, (width - ctx.measureText(txt).width) / 2, height * 0.15);
            ctx.fillText(txt, (width - ctx.measureText(txt).width) / 2, height * 0.15);
        }
    }

    var drawShadow = function () {
        if (ctx && canvas) {
            var left_shadow = "linear, " + ((width * 0.35 - 170) / width * 100.) + "% 0, " + ((width * 0.35 + 60) / width * 100.) + "% 0, from(black), to(rgba(0,0,0,0))";
            var right_shadow = "linear, " + ((width * 0.35 + 190) / width * 100.) + "% 0, " + ((width * 0.35 - 30) / width * 100.) + "% 0, from(black), to(rgba(0,0,0,0))";
            var grd = ctx.createLinearGradient(width * 0.35 - 170, 0, width * 0.35 + 60, 0);
            grd.addColorStop(0, "black");
            grd.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = grd;
            ctx.fillRect((width * 0.35 - 170), 0, 230, height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, (width * 0.35 - 170), height);
            grd = ctx.createLinearGradient(width * 0.35 - 30, 0, width * 0.35 + 190, 0);
            grd.addColorStop(0, "rgba(0, 0, 0, 0)");
            grd.addColorStop(1, "black");
            ctx.fillStyle = grd;
            ctx.fillRect((width * 0.35 - 30), 0, 220, height);
            ctx.fillStyle = "black";
            ctx.fillRect(width * 0.35 + 190, 0, width * 0.65 - 190, height);
        }
    }

    var drawHidden = function () {
        if (ctx && canvas) {
            ctx.fillStyle = "black";
            ctx.fillRect(width * 0.35, 30, 300, height - 180);
        }
    }

    var drawCanvas = function () {
        clearCanvas();
        drawSky();
        for (var i = pipeSt; i < pipeNumber; ++i) {
            drawPipe(width - dist + i * 220, pipes[i]);
            if (mode == 2) {
                if (pipesDir[i]) {
                    if (pipes[i] + 1 > height - 300) {
                        pipesDir[i] = !pipesDir[i];
                        pipes[i] -= 1;
                    }
                    else
                        pipes[i] += 1;
                }
                else {
                    if (pipes[i] - 1 < 10) {
                        pipesDir[i] = !pipesDir[i];
                        pipes[i] += 1;
                    }
                    else
                        pipes[i] -= 1;
                }
            }
        }
        drawLand();
        if (flashlight_switch)
            drawShadow();
        else if (hidden_switch)
            drawHidden();
        drawBird();
        drawScore();
    }

    var anim = function () {

        if (maxScore > 10) {
            animation = setInterval(drawCanvas, 500 / 60);
        } else {
            animation = setInterval(drawCanvas, 1000 / 60);
        }

    }

    var jump = function () {

        if (!isDeath) {


            if (death) {
                dist = 0;
                birdY = (height - 112) / 2;
                birdF = 0;
                birdN = 0;
                birdV = 0;
                death = 0;
                score = 0;
                birdPos = width * 0.35;
                pipeSt = 0;
                pipeNumber = 10;
                pipes = [];
                pipesDir = [];
                for (var i = 0; i < 10; ++i) {
                    pipes.push(Math.floor(Math.random() * (height - 300 - delta) + 10));
                    pipesDir.push((Math.random() > 0.5));
                }
                animation = setInterval(drawCanvas, 800 / 60);
            } else {

            }
            if (mode == 0)
                birdV = 6;
            else if (mode == 1)
                birdV = 6;
            else
                birdV = 6;
        }
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();

        console.log(maxScore);
        if (name.length === 0) {

        } else {
            setSaveSubmitting(true)
            setSaveScore(false);
            setIsName(true);
            ApiServices().writeUserData(maxScore, false, name).then((res) => {
                UtilityService().clickSendEvent('Click', 'Play', 'Submit ' + name + ' : ' + score);
                setSaveScore(true);
            });
        }


      
    }

    const handleChange = (e: any) => {
        console.log(e.target.value);
        setName(e.target.value);
    }

    const closeModal = () => {
        window.open('/', '_self');
    }

    const gotoLeaderBoard = () => {
        navigate('/leaderboard');
        UtilityService().clickSendEvent('Click', 'Play', 'Go to Leaderboard' );
    }
    return (
        <>
            <canvas id="canvas" ref={canvasRef}>Flappy work</canvas>
            {
                isDeath ?

                    <div className="modal-control">
                        <div className="modal-content">
                            <div className="Modal" >

                                {
                                    !isName && !isSubmitting ?
                                        <div className="score-control">
                                            <h2 className="text-score-header">Your name</h2>
                                            <form onSubmit={handleSubmit}>
                                                <div className="input-control">
                                                    <input type="text" name="name" onChange={handleChange} maxLength={8} className="input-style" />
                                                    <input type="submit" value="Submit" className={
                                                        name.length == 0 ? 'button-start-disable' : 'button-start'
                                                    } />
                                                </div>
                                            </form>
                                        </div> :
                                        isSubmitting && !isSaveScore ?

                                            <div className="score-control">
                                                <span className="text-saving">Saving ...</span>
                                            </div> :

                                            isSaveScore &&

                                            <div className="score-control">
                                                <h2 className="text-score-header">Your Score</h2>
                                                <span className="text-score">{maxScore}</span>
                                                <button className='button-leaderboard' onClick={gotoLeaderBoard}>Leaderboard</button>
                                                <span className="close-text" onClick={closeModal}>close</span>
                                            </div> 
                                }
                            </div>
                        </div>
                    </div> : null
            }
        </>

    )
}

export default LandingComponent;