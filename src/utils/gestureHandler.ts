import { NormalizedLandmark, Results } from '@mediapipe/hands';
export enum Gesture {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  PLAY = 'PLAY',
  STOP = 'STOP',
  FIST = 'FIST',
  BOMB = 'BOMB',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}
/**
 * 根据检测出来的值来判断手势
 * 1. thumb 4 3 2
 * 2. first finger 8 7 6 5
 * 3. second finger 12 11 10 9
 * 4. third finger 16 15 14 13
 * 5. four finger 20 19 18 17
 * @param results
 */
export const gestureHandler = (results: Results) => {
  if (!results.multiHandLandmarks.length) return;

  if (
    results.multiHandedness.length === 2 &&
    results.multiHandedness[0].label !== results.multiHandedness[1].label
  )
    return Gesture.STOP;

  const hand = results.multiHandLandmarks[0];

  const thumbDirection = hand[4].y < hand[2].y && hand[4].y < hand[3].y;
  const thumbK = getK(hand[4], hand[2]);
  const isThumbClose = getK(hand[4], hand[2]) * getK(hand[2], hand[0]) < 0;

  const firstFingerDirection = hand[8].y < hand[6].y && hand[8].y < hand[7].y;
  const isFirstFingerClose =
    (hand[8].x > hand[5].x && hand[8].x < hand[0].x) ||
    (hand[8].y > hand[5].y && hand[8].y < hand[0].y);

  const secondFingerDirection =
    hand[12].y < hand[10].y && hand[12].y < hand[11].y;
  const isSecondFingerClose =
    (hand[12].x > hand[9].x && hand[12].x < hand[0].x) ||
    (hand[12].y > hand[9].y && hand[12].y < hand[0].y);

  const thirdFingerDirection =
    hand[16].y < hand[15].y && hand[16].y < hand[13].y;
  const isThirdFingerClose =
    (hand[16].x > hand[13].x && hand[16].x < hand[0].x) ||
    (hand[16].y > hand[13].y && hand[16].y < hand[0].y);

  const lastFingerDirection =
    hand[20].y < hand[18].y && hand[20].y < hand[19].y;
  const isLastFingerClose =
    (hand[17].x - hand[20].x) * (hand[17].x - hand[0].x) > 0 ||
    (hand[17].y - hand[20].y) * (hand[17].y - hand[0].y) > 0;

  if (
    thumbDirection &&
    firstFingerDirection &&
    secondFingerDirection &&
    thirdFingerDirection &&
    lastFingerDirection
  ) {
    return Gesture.PLAY;
  }
  if (
    isThumbClose &&
    firstFingerDirection &&
    isSecondFingerClose &&
    isThirdFingerClose &&
    isLastFingerClose
  ) {
    return Gesture.ONE;
  }
  if (
    isThumbClose &&
    firstFingerDirection &&
    secondFingerDirection &&
    isThirdFingerClose &&
    isLastFingerClose
  ) {
    return Gesture.TWO;
  }
  if (
    !firstFingerDirection &&
    secondFingerDirection &&
    thirdFingerDirection &&
    lastFingerDirection
  ) {
    return Gesture.THREE;
  }
  if (
    isThumbClose &&
    firstFingerDirection &&
    secondFingerDirection &&
    thirdFingerDirection &&
    lastFingerDirection
  ) {
    return Gesture.FOUR;
  }

  if (
    isThumbClose &&
    isFirstFingerClose &&
    isSecondFingerClose &&
    isThirdFingerClose &&
    isLastFingerClose
  ) {
    return Gesture.FIST
  }

  if (
    thumbDirection &&
    firstFingerDirection &&
    isSecondFingerClose &&
    isThirdFingerClose &&
    lastFingerDirection
  ) {
    return Gesture.BOMB
  }

  if (
    thumbDirection &&
    isFirstFingerClose &&
    isSecondFingerClose &&
    isThirdFingerClose &&
    isLastFingerClose
  ) {
    if (thumbK > 0) return Gesture.LEFT;
    else return Gesture.RIGHT;
  }
};

export const getK = (
  point1: NormalizedLandmark,
  point2: NormalizedLandmark
) => {
  return (point1.y - point2.y) / (point1.x - point2.x);
};
