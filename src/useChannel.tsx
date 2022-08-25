import { useState, useContext, useEffect, useRef } from 'react';
import { PhoenixSocketContext } from './PhoenixSocketContext';
import { Channel, Push } from 'phoenix'

export default function useChannel(topic: string, params: any, onJoin: any) {

    const socket = useContext(PhoenixSocketContext);
    const [channel, setChannel] = useState<Channel | null>(null);

    // TODO: Understand how this works
    const onJoinFun = useRef(onJoin);
    onJoinFun.current = onJoin;


    // Runs on component updates
    useEffect(() => {

        if (socket === null) return;

        const ch = socket.channel(topic, params);

        ch.join().receive('ok', message => {
            onJoinFun.current(ch, message)
        });
        setChannel(ch);

        // leave the channel when the component unmounts
        return () => {
            ch.leave();
            setChannel(null);
        };
    }, [socket, topic, params]);

    return channel;
};

function pushPromise(push: Push) {
    return new Promise((resolve, reject) => {
        if (!push) {
            return reject("no push")
        }
        push.receive('ok', resolve).receive('error', reject);
    })
}

export function sendMessage(channel: Channel, event: string, payload: any) {
    return pushPromise(channel.push(event, payload));
}

export function useEventHandler(channel: Channel, event: string, handler: any) {
    const handlerRef = useRef(handler);
    handlerRef.current = handler

    useEffect(() => {
        if (channel === null) return;

        const ref = channel.on(event, message => handlerRef.current(message))

        return () => channel.off(event, ref)
    }, [channel, event])
}
