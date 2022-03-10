import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { css } from '@emotion/css';
import { Camera } from '@mediapipe/camera_utils';
import { Hands, Results } from '@mediapipe/hands';
import { drawCanvas } from './utils/drawCanvas';
import { Gesture, gestureHandler } from './utils/gestureHandler';
import GameBoard from './components/GameBoard';
import GamePause from './components/GamePause';
import bombImg from './assets/bomb.png';
import { debounce, throttle } from 'lodash';
const App = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultsRef = useRef<any>(null);
  const [gesture, setGesture] = useState<Gesture | undefined>();
  const [isGameStart, setIsGameStart] = useState(false);
  const [bomb, setBomb] = useState(0);
  const [score, setScore] = useState<undefined | number>();

  /**
   * 根据 webcam 的捕获检测结果
   * @param results
   */
  const onResults = useCallback((results: Results) => {
    resultsRef.current = results;
    const gesture = gestureHandler(results);
    setGesture(gesture);
    if (gesture === Gesture.STOP) {
      setIsGameStart(false);
    }
    if (gesture === Gesture.PLAY) {
      setIsGameStart(true);
    }
    const canvasCtx = canvasRef.current!.getContext('2d')!;
    drawCanvas(canvasCtx, results);
  }, []);

  // 一些个初始化监听
  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      const camera = new Camera(webcamRef.current.video!, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current!.video! });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [onResults]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user',
  };

  const updateBomb = debounce((type) => {
    setBomb((pre) => pre + type);
  }, 500);

  const renderBombs = () => {
    const bombs = [];
    for (let i = 0; i < bomb; i++) {
      bombs.push(<img src={bombImg} key={`bomb_${i}`}></img>);
    }
    return <div className={styles.bombsRespository}>{bombs}</div>;
  };

  const getScore = (score: number) => {    
    setScore((pre) => (pre || 0) + score);
  };

  const gameOver=()=>{
    setIsGameStart(false)
  }
  return (
    <div className={styles.container}>
      {/* capture */}
      <Webcam
        audio={false}
        style={{ visibility: 'hidden', position: 'absolute' }}
        width={1280}
        height={180}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      {/* draw */}
      <canvas ref={canvasRef} className={styles.canvas} />
      {/* game board */}
      {isGameStart ? (
        <GameBoard
          gesture={gesture}
          updateBomb={updateBomb}
          bombs={bomb}
          getScore={getScore}
          gameOver={gameOver}
        />
      ) : (
        <GamePause score={score} />
      )}
      {renderBombs()}
      <div className={styles.gestureResult}>GESTURE : {gesture}</div>
    </div>
  );
};

const styles = {
  container: css`
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  canvas: css`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 320px;
    height: 180px;
    background-color: #fff;
  `,
  gestureResult: css`
    position: absolute;
    top: 20px;
    left: 20px;
    font-weight: 700;
    font-size: 30px;
    color: red;
  `,
  bombsRespository: css`
    position: absolute;
    top: 100px;
    display: flex;
    flex-wrap: wrap;
    width: 25%;
    left: 0;
  `,
};

export default App;
