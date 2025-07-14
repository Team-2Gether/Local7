// src/user/hook/useMessageDisplay.js
import { useState, useCallback } from 'react';

const useMessageDisplay = () => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const displayMessage = useCallback((msg, type) => {
        setMessage(msg);
        setMessageType(type);
        const timer = setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return { message, messageType, displayMessage };
};

export default useMessageDisplay;