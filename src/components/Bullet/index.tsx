import React, { useContext, useEffect, useRef, useState } from 'react';
import { Gesture } from '../../utils/gestureHandler';
import bullet1 from '../../assets/bullet1.png';
import bullet2 from '../../assets/bullet2.png';
import { GameContext } from '../GameBoard';

export enum BulletType {
  LEVEL1 = 'LEVEL1',
  LEVEL2 = 'LEVEL2',
}

const Bullet = (props: {
  id: any;
  top: number;
  left: number;
  bulletPositionChange: (id: string, top: number, left: number) => void;
}) => {
  const { popBullet, bulletsRect } = useContext(GameContext);
  const { id, bulletPositionChange } = props;
  const [top, setTop] = useState(props.top);
  const [left] = useState(props.left);
  const bulletRef = useRef<any>();
  const moveTimer = useRef<NodeJS.Timeout>();
  const [show, setIsShow] = useState(true);

  useEffect(() => {
    if (!bulletRef.current?.offsetTop || bulletRef.current?.offsetTop <= 0) {
      popBullet(id);
      setIsShow(false);
      return;
    }
    bulletPositionChange(
      id,
      bulletRef.current?.offsetTop,
      bulletRef.current?.offsetLeft
    );
  }, [bulletRef.current?.offsetTop]);

  useEffect(() => {
    setTop(0);
    moveTimer.current = setTimeout(() => {
      popBullet(id);
      setIsShow(false);
    }, 5000);
    return () => {
      clearTimeout(moveTimer.current!);
    };
  }, []);

  useEffect(()=>{
    if(!bulletsRect[id]) setIsShow(false)
  },[bulletsRect])
  
  return show ? (
    <img
      id={id}
      ref={bulletRef}
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        transition: 'all 5s linear',
      }}
      src={bullet1}
    ></img>
  ) : null;
};

export default Bullet;
