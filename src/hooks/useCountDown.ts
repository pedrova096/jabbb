import { useEffect, useState } from 'react';

type UseCountDown = {
  seconds: number;
  onEnd: () => void;
};

export const useCountDown = ({ seconds, onEnd }: UseCountDown) => {
  const [count, setCount] = useState(seconds);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    console.log(`Countdown is ${count} and is ${play ? 'playing' : 'paused'}`);
    // edge cases
    // 1. count is 0 and is not playing -> default
    // 3. count > 0 and is not playing -> default
    // 2. count is 0 and is playing -> onEnd
    // 4. count > 0 and is playing -> continue
    if (!play && count >= 0) {
      return;
    }

    if (play && count <= 0) {
      onEnd();
      setPlay(false);
      return;
    }

    const timer = setInterval(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count, play]);

  const startCountDown = () => {
    setCount(seconds);
    setPlay(true);
  };

  return {
    count,
    setCount,
    startCountDown,
    isPlaying: play,
  };
};
