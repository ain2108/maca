import React, { createContext, useEffect, useState } from 'react';
import { Socket } from 'phoenix';




const PhoenixSocketContext = createContext<Socket | null>(null);

function PhoenixSocketProvider({ children }: { children: any }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = new Socket('/socket');
        socket.connect();
        setSocket(socket);
    });

    if (!socket) return null;

    return (
        <PhoenixSocketContext.Provider value={socket}>{children}</PhoenixSocketContext.Provider>
    );
}


export { PhoenixSocketContext, PhoenixSocketProvider };
