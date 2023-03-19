import { observer } from 'mobx-react-lite';
import React, { FC, useState, useEffect } from 'react';
import './GameOver.css';
import { useGame } from '../../../components/StoreContext';
import { Message } from './Message';

export const ReadyMessage: FC<{ className?: string }> = observer(
  ({ className }) => {
    const game = useGame();
    const readyMessageVisible = game.isReady;

    // Add a state for the remaining time
    const [timeLeft, setTimeLeft] = useState(0);

    // Create a countdown timer effect
    useEffect(() => {
      if (readyMessageVisible) {
        setTimeLeft(3);
        const timer = setInterval(() => {
          setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
        }, 1000);
        return () => clearInterval(timer);
      }
    }, [readyMessageVisible]);

    return readyMessageVisible ? (
      <Message text={`Ready! ${timeLeft}`} />
    ) : null;
  }
);
