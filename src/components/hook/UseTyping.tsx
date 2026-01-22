import { useEffect, useRef } from 'react';

export const useTyping = (
  input: string, 
  sendTypingEvent: (isTyping: boolean) => void
) => {
  const isTypingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Keep a reference to the latest version of the function
  const sendEventRef = useRef(sendTypingEvent);
  useEffect(() => {
    sendEventRef.current = sendTypingEvent;
  }, [sendTypingEvent]);

  useEffect(() => {
    const trimmed = input.trim();

    // If input is empty, stop immediately
    if (trimmed.length === 0) {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        sendEventRef.current(false);
      }
      return;
    }

    // Only send START if we weren't already typing
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendEventRef.current(true);
    }

    // Debounce the stop event
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendEventRef.current(false);
    }, 2000);

  }, [input]); // <--- NO MORE sendTypingEvent here. THE LOOP IS BROKEN.
};