import { useState, useContext, useEffect } from 'react';
import { PhoenixSocketContext } from './PhoenixSocketContext';
import { Channel } from 'phoenix'

function useChannel({ channelName }: { channelName: string }) {

    const [channel, setChannel] = useState<Channel | null>(null);
    const socket = useContext(PhoenixSocketContext);

    // Runs on component updates
    useEffect(() => {

        if (!socket) return;

        const phoenixChannel = socket.channel(channelName);

        // If connecteed to channel well, set it
        phoenixChannel?.join().receive('ok', () => {
            setChannel(phoenixChannel);
        });

        // leave the channel when the component unmounts
        return () => {
            phoenixChannel.leave();
        };
    }, []);
    // only connect to the channel once on component mount
    // by passing the empty array as a second arg to useEffect

    return [channel];
};

export default useChannel;
