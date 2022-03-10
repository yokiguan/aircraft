import { css } from '@emotion/css';
import background from '../../assets/background.png';
import resume from '../../assets/resume.png';

const GamePause = (props: { score: number | undefined }) => {
  return (
    <div
      id="game-board"
      className={styles.board}
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className={styles.content}>
        <div className={styles.title}>
          {props.score}
          {props.score === undefined ? '开 始 游 戏' : '再 来 一 把'}
        </div>
        <img src={resume} width='200px'/>
      </div>
    </div>
  );
};
const styles = {
  board: css`
    height: 100%;
    width: 50%;
    position: relative;
    overflow: hidden;
  `,
  title: css`
    margin-bottom: 50px;
  `,
  content: css`
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    font-size:70px;
    font-weight:bold;
    display:flex;
    flex-direction:column;
    align-items:center;
    color:#444343;
  `,
};
export default GamePause;
