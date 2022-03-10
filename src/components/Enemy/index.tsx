import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Gesture } from '../../utils/gestureHandler';
import enemy1 from '../../assets/enemy1.png';
import enemy1_hit from '../../assets/enemy1_down1.png';
import enemy1_down1 from '../../assets/enemy1_down1.png';
import enemy1_down2 from '../../assets/enemy1_down2.png';
import enemy1_down3 from '../../assets/enemy1_down3.png';
import enemy1_down4 from '../../assets/enemy1_down4.png';

import enemy2 from '../../assets/enemy2.png';
import enemy2_hit from '../../assets/enemy2_hit.png';
import enemy2_down1 from '../../assets/enemy2_down1.png';
import enemy2_down2 from '../../assets/enemy2_down2.png';
import enemy2_down3 from '../../assets/enemy2_down3.png';
import enemy2_down4 from '../../assets/enemy2_down4.png';

import enemy3 from '../../assets/enemy3.png';
import enemy3_hit from '../../assets/enemy3_hit.png';
import enemy3_down1 from '../../assets/enemy3_down1.png';
import enemy3_down2 from '../../assets/enemy3_down2.png';
import enemy3_down3 from '../../assets/enemy3_down3.png';
import enemy3_down4 from '../../assets/enemy3_down4.png';
import { GameContext } from '../GameBoard';

export enum EnemyStatus {
  ALIVE = 'ALIVE',
  HIT = 'HIT',
  DESTROY = 'DESTROY',
}

const Enemy = (props: {
  id: any;
  popEnemy: (id: any) => void;
  enemysPositionChange: (
    id: string,
    top: number,
    left: number,
    width: number
  ) => void;
  left: string;
  level: number;
  status: EnemyStatus;
}) => {
  const { id, level, enemysPositionChange, left } = props;
  const [top, setTop] = useState(0);
  const [status, setStatus] = useState(props.status);
  const count = useRef(0);
  const popTimer = useRef<NodeJS.Timeout>();
  const animationTimer = useRef<NodeJS.Timeout>();

  const enemyAliveArr = [enemy1, enemy2, enemy3];
  const enemyHitArr = [enemy1_hit, enemy2_hit, enemy3_hit];
  const enemyDestroyArr = [
    [enemy1_down1, enemy1_down2, enemy1_down3, enemy1_down4],
    [enemy2_down1, enemy2_down2, enemy2_down3, enemy2_down4],
    [enemy3_down1, enemy3_down2, enemy3_down3, enemy3_down4],
  ];
  const [image, setImage] = useState(enemyAliveArr[level]);
  const enemyRef = useRef<any>();
  const [isShow, setIsShow] = useState(true);
  const { hittedEnemys, popEnemy, enemysRect, poiltRef, gameOver } =
    useContext(GameContext);

  useEffect(() => {
    setTop(100);
    const timer = setTimeout(() => {
      setIsShow(false);
      popEnemy(id);
      clearInterval(timer);
    }, 5000);
    return () => clearTimeout(timer);
  }, [enemyRef.current]);

  useEffect(() => {
    if (hittedEnemys.includes(id)) {
      setStatus(EnemyStatus.DESTROY);
    }
  }, [hittedEnemys]);

  useEffect(() => {
    clearInterval(animationTimer.current!);
    clearTimeout(popTimer.current!);

    if (status === EnemyStatus.HIT) {
      setImage(enemyHitArr[level]);
    } else if (status === EnemyStatus.DESTROY) {
      animationTimer.current = setInterval(() => {
        setImage(enemyDestroyArr[level][count.current % 4]);
        count.current += 1;
      }, 100);
      popTimer.current = setTimeout(() => {
        clearInterval(animationTimer.current!);
        clearTimeout(popTimer.current!);
        popEnemy(id);
        setIsShow(false);
      }, 500);
    }
    return () => {
      clearInterval(animationTimer.current!);
      clearTimeout(popTimer.current!);
    };
  }, [status]);

  useEffect(() => {
    if (isShow)
      enemysPositionChange(
        id,
        enemyRef.current.offsetTop + enemyRef.current.height,
        enemyRef.current?.offsetLeft,
        enemyRef.current?.width
      );
  }, [enemyRef.current?.offsetTop, isShow]);

  useEffect(() => {
    if (!enemysRect[id]) setIsShow(false);
  }, [enemysRect]);

  return isShow ? (
    <img
      ref={enemyRef}
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}`,
        transition: 'top 5s linear',
        transform: 'translateZ(0)',
      }}
      src={image}
    ></img>
  ) : null;
};

export default Enemy;
