import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({timeLeft, totalTime}) => {
    const displayTime = timeLeft !== undefined ? timeLeft : 0;
    const limit = totalTime || 60;
    const percentage = (displayTime / limit) * 100 || 0;
  return (
    <div className='w-20 h-20'>
      <CircularProgressbar value={percentage} text={`${displayTime}s`}
        style={buildStyles({
            textSize: '28px',
            pathColor: "#46d7e7",
            textColor: '#1e98a5',
            trailColor: '#d6d6d6',
        })} />
    </div>
  )
}

export default Timer
