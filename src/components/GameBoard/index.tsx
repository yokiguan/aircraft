import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { css } from '@emotion/css';
import background from '../../assets/background.png';
import Poilt, { PoiltStatus } from '../Poilt';
import Bullet from '../Bullet';
import { Gesture } from '../../utils/gestureHandler';
import { debounce, throttle, uniqueId } from 'lodash';
import Enemy, { EnemyStatus } from '../Enemy';
import Bomb from '../Bomb';

type IContext = {
  hittedEnemys: string[];
  bulletsRect: { [key: string]: any };
  enemysRect: { [key: string]: any };
  popBullet: (id: string) => void;
  popEnemy: (id: string) => void;
  gameOver: () => void;
  poiltRef: any;
};
export const GameContext = createContext<IContext>({
  hittedEnemys: [],
  bulletsRect: {},
  enemysRect: {},
  poiltRef: undefined,
  popBullet: (id: string) => {},
  popEnemy: (id: string) => {},
  gameOver: () => {},
});

const GameBoard = (props: {
  gesture: Gesture | undefined;
  bombs: number;
  updateBomb: (type: number) => void;
  getScore: (score: number) => void;
  gameOver: () => void;
}) => {
  const { gesture, updateBomb, bombs, getScore, gameOver } = props;
  const poiltRef = useRef<any>();
  const [hittedEnemys, setHittedEnemys] = useState<string[]>([]);
  const [bulletsRect, setBulletsRect] = useState<{ [key: string]: any }>({});
  const [bullets, setBullets] = useState<any[]>([]);
  const [enemys, setEnemys] = useState<any[]>([]);
  const [enemysRect, setEnemysRect] = useState<{ [key: string]: any }>({});
  const [bomb, setBomb] = useState({ isShow: false, left: 0 });
  const [poiltLeft, setPoiltLeft] = useState(0);
  const bulletTimer = useRef<NodeJS.Timeout>();
  const bombTimer = useRef<NodeJS.Timeout>();
  const enemyTimer = useRef<NodeJS.Timeout>();
  const moveTimer = useRef<NodeJS.Timeout>();

  const popBullet = useCallback((id: any) => {
    setBulletsRect((origin) => {
      delete origin[id];
      return { ...origin };
    });
  }, []);

  const popEnemy = useCallback((id: any) => {
    setEnemysRect((origin) => {
      delete origin[id];
      return { ...origin };
    });
  }, []);

  const hitEnemy = useCallback(
    (id: any, level: number) => {
      if (hittedEnemys.includes(id)) return;
      setHittedEnemys([...hittedEnemys, id]);
      getScore(level + 1);
    },
    [hittedEnemys]
  );

  const bulletPositionChange = (id: string, top: number, left: number) => {
    setBulletsRect((origin) => {
      origin[id] = { ...origin[id], top, left };
      return { ...origin };
    });
  };

  const enemysPositionChange = (
    id: string,
    top: number,
    left: number,
    width: number
  ) => {
    setEnemysRect((origin) => {
      origin[id] = { ...origin[id], top, width, left };
      return { ...origin };
    });
  };

  const calculateRectCross = throttle((bulletsRect, enemysRect) => {
    for (let bulletId in bulletsRect) {
      const bulletRect = bulletsRect[bulletId];
      for (let enemyId in enemysRect) {
        const enemyRect = enemysRect[enemyId];
        if (
          bulletRect.top <= enemyRect.top &&
          bulletRect.left >= enemyRect.left &&
          bulletRect.left <= enemyRect.left + enemyRect.width
        ) {
          popBullet(bulletId);
          hitEnemy(enemyId, enemyRect.level);
        }
      }
    }
  }, 300);

  useEffect(() => {
    calculateRectCross(bulletsRect, enemysRect);
  }, [bulletsRect, enemysRect]);

  const addBullet = useCallback(() => {
    const { width, offsetLeft, offsetTop } = poiltRef.current;
    const left = offsetLeft + width / 2;
    const id = uniqueId('bullet_');

    setBulletsRect((origin) => {
      origin[id] = { top: offsetTop, left };
      return { ...origin };
    });

    setBullets((bullets) => [
      ...bullets,
      <Bullet
        id={id}
        key={id}
        top={offsetTop}
        left={left}
        bulletPositionChange={bulletPositionChange}
      />,
    ]);
  }, [poiltRef.current]);

  useEffect(() => {
    bulletTimer.current = setInterval(addBullet, 300);

    enemyTimer.current = setInterval(() => {
      const left = `${Math.random() * 90}%`;
      const level = Math.floor(Math.random() * 3);
      const id = uniqueId('enemy_');
      setEnemysRect((origin) => {
        origin[id] = { top: 0, level };
        return { ...origin };
      });

      setEnemys((origin) => [
        ...origin,
        <Enemy
          id={id}
          key={id}
          popEnemy={popEnemy}
          left={left}
          status={EnemyStatus.ALIVE}
          level={level}
          enemysPositionChange={enemysPositionChange}
        />,
      ]);
    }, 1000);

    bombTimer.current = setInterval(() => {
      setBomb({ isShow: true, left: Math.random() * 90 });
    }, 10000);

    return () => {
      clearInterval(bulletTimer.current!);
      clearInterval(enemyTimer.current!);
      clearInterval(bombTimer.current!);
    };
  }, []);

  useEffect(() => {
    if (bomb.isShow && gesture === Gesture.FIST) {
      setBomb({ isShow: false, left: 0 });
      updateBomb(1);
    }
    if (gesture === Gesture.BOMB) {
      if (bombs !== 0) {
        updateBomb(-1);
        for (let enemyId in enemysRect) {
          hitEnemy(enemyId, enemysRect[enemyId].level);
        }
      }
    }
  }, [gesture, bomb, bombs, enemysRect]);

  useEffect(() => {
    clearInterval(moveTimer.current!);
    // 左移
    if (gesture === Gesture.LEFT) {
      moveTimer.current = setInterval(() => {
        if (poiltLeft >= 90) return clearInterval(moveTimer.current!);
        setPoiltLeft(poiltLeft + 5);
      }, 300);
    }
    // 右
    if (gesture === Gesture.RIGHT) {
      moveTimer.current = setInterval(() => {
        if (poiltLeft <= 0) return clearInterval(moveTimer.current!);
        setPoiltLeft(poiltLeft - 5);
      }, 300);
    }
    return () => {
      moveTimer.current && clearInterval(moveTimer.current!);
    };
  }, [gesture, poiltLeft]);

  return (
    <GameContext.Provider
      value={{
        hittedEnemys,
        bulletsRect,
        enemysRect,
        popBullet,
        popEnemy,
        gameOver,
        poiltRef: poiltRef.current,
      }}
    >
      <div
        id="game-board"
        className={styles.board}
        style={{ backgroundImage: `url(${background})` }}
      >
        {bullets}
        {enemys}
        {bomb.isShow ? <Bomb left={bomb.left} /> : null}
        <Poilt
          poiltRef={poiltRef}
          status={PoiltStatus.ALIVE}
          left={poiltLeft}
        />
      </div>
    </GameContext.Provider>
  );
};
const styles = {
  board: css`
    height: 100%;
    width: 50%;
    position: relative;
    overflow: hidden;
  `,
};
export default GameBoard;
