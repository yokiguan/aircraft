import React, { useEffect, useRef, useState } from 'react';
import alive1 from '../../assets/me1.png';
import alive2 from '../../assets/me2.png';
import destroy1 from '../../assets/me_destroy_1.png';
import destroy2 from '../../assets/me_destroy_2.png';
import destroy3 from '../../assets/me_destroy_3.png';
import destroy4 from '../../assets/me_destroy_4.png';
import { Gesture } from '../../utils/gestureHandler';

export enum PoiltStatus {
  ALIVE = 'ALIVE',
  DESTROY = 'DESTROY',
}

const Poilt = (props: {
  status: PoiltStatus;
  poiltRef: any;
  left: number
}) => {
  const { status, poiltRef} = props;
  const timer = useRef<NodeJS.Timer>();
  const count = useRef(0);
  const [image, setImage] = useState(alive1);
  const aliveImage = [alive1, alive2];
  const destroyImage = [destroy1, destroy2, destroy3, destroy4];
  const [left, setLeft] = useState(props.left);

  useEffect(() => {
    if (status === PoiltStatus.ALIVE) {
      clearInterval(timer.current!);
      count.current = 0;
      const loop = setInterval(() => {
        setImage(aliveImage[count.current % 2]);
        count.current += 1;
      });
      timer.current = loop;
    } else {
      clearInterval(timer.current!);
      count.current = 0;
      const loop = setInterval(() => {
        setImage(destroyImage[count.current % 4]);
        count.current += 1;
      }, 500);
      timer.current = loop;
    }
  });

  useEffect(()=>{  
    setLeft(props.left)
  },[props.left])

  return (
    <img
      src={image}
      ref={poiltRef}
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${left}%`,
        transition: 'all 0.3s linear',
      }}
    ></img>
  );
};

export default Poilt;
