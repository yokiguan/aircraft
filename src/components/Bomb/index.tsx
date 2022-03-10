import React, { useEffect, useState } from 'react';
import bomb_supply from '../../assets/bomb_supply.png';

const Bomb = (props: { left: number }) => {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(props.left);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTop(100);
      setLeft(100);
    }, 20);
    return () => clearTimeout(timer);
  }, []);

  return (
    <img
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        transition: 'all 5s linear',
        transform: 'translateZ(0)',
      }}
      alt="bomb"
      src={bomb_supply}
    ></img>
  );
};

export default Bomb;
