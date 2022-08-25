import React, { createContext, useEffect, useState } from 'react';
import { Socket } from 'phoenix';




const PhoenixSocketContext = createContext<Socket | null>(null);

function PhoenixSocketProvider(children: any, options: any, url: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const s = new Socket(url, options)
        s.connect()
        setSocket(s)

        return () => {
            s.disconnect()
            setSocket(null)
        }

    }, [options, url])

    return (
        <PhoenixSocketContext.Provider value={socket}>{children}</PhoenixSocketContext.Provider>
    );
}


export { PhoenixSocketContext, PhoenixSocketProvider };
