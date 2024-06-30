import { useState, useEffect, useCallback } from 'react';

function useCountdown(startingTime: number, countOnStart = true) {
    const [timeLeft, setTimeLeft] = useState(countOnStart === true ? startingTime : 0);

    useEffect(() => {
        if (timeLeft <= 0) 
            return;

        const timerId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    const restartCountdown = useCallback(() => {
        setTimeLeft(startingTime);
    }, [startingTime]);

    return {
        timeLeft,
        restartCountdown
    }
}

export default useCountdown;
