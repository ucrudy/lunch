import React, { useCallback, useEffect } from 'react';
import { useAppContext } from "./AppContext";

const ScrollAttempt = () => {
  // State to track if the user is attempting to scroll
  const { setIsScrolling } = useAppContext();
  let scrollTimer: string | number | NodeJS.Timeout | undefined;

  // Detect wheel or touch move events
  const handleScrollAttempt = useCallback(() => {
    setIsScrolling(true);

    // After a small delay, reset the state to false (no longer scrolling)
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      setIsScrolling(false);
    }, 100); // Adjust this delay as needed
  }, [scrollTimer]);

  // Set up event listeners for wheel and touchmove
  useEffect(() => {
    // Listen for mouse wheel or touch move events
    window.addEventListener('wheel', handleScrollAttempt, { passive: true });
    window.addEventListener('touchmove', handleScrollAttempt, { passive: true });

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('wheel', handleScrollAttempt);
      window.removeEventListener('touchmove', handleScrollAttempt);
      if (scrollTimer) clearTimeout(scrollTimer); // Clean up the timer
    };
  }, [handleScrollAttempt, scrollTimer]);

  return (
      <>
      </>
  );
};

export default ScrollAttempt;
