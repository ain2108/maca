
import './App.css';

import { Button, IconButton } from '@mui/material';

import React, { useEffect, useState } from 'react';
import useChannel from './useChannel';


enum Category {
  Games = "Games",
  Books = "Books",
  Films = "Films",
  Paintings = "Paintings",
  Links = "Links",
}


export interface MacaMessage {
  id: string;
  type: string;
  subtype?: string;
  parameters?: Map<string, object>;
}

async function getResources(category: Category): Promise<Resource[]> {
  try {
    const response = await fetch('http://localhost:4000/api/resources/' + category)
    const json = await response.json();
    console.log(json)
    return json
  } catch (error) {
    console.log(error)
    return []
  }
}

function send(msg: MacaMessage) {
  console.log(msg)
}

type Resource = {
  title: string;
  category: Category;
}

function MyButton({ setResources, category }: { setResources: React.Dispatch<React.SetStateAction<Resource[]>>, category: Category }) {

  function handleClick(): void {
    send({ id: "1234", type: "asdasd" })
    getResources(category)
      .then(rs => setResources(rs))
  }

  return (
    <Button onClick={handleClick} variant="text">{category}</Button>

  );
}

function ResourceElement({ resource }: { resource: Resource }) {
  return (
    <tr>
      <td> {resource.title}</td>
    </tr>
  );
}

function ResourceTable({ resources }: { resources: Resource[] }) {

  let rows = resources.map(r =>
    <ResourceElement resource={r} />
  )

  return (
    <table>
      <thead>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function Buttons({ categories, setResources }: { categories: Category[], setResources: React.Dispatch<React.SetStateAction<Resource[]>> }) {
  const buttons = categories.map(c => <MyButton category={c} setResources={setResources} />)
  return <div>{buttons}</div>
}

function ServerTimeDisplay() {
  const [serverTimeChannel] = useChannel({ channelName: 'time' });
  const READ_SERVER_TIME_MESSAGE = 'read_server_time';
  const [serverTime, setServerTime] = useState(null);

  // listening for messages from the channel
  useEffect(() => {
    if (!serverTimeChannel) return;

    //the LOAD_SCREENSHOT_MESSAGE is a message defined by the server
    const subRef = serverTimeChannel.on(READ_SERVER_TIME_MESSAGE, response => {
      setServerTime(response.data.server_time);
    });

    // stop listening to this message before the component unmounts
    return () => {
      serverTimeChannel.off(READ_SERVER_TIME_MESSAGE, subRef);
    };
  }, [serverTimeChannel]);

  // pushing messages to the channel
  useEffect(() => {
    if (!serverTimeChannel) return;

    serverTimeChannel.push(READ_SERVER_TIME_MESSAGE, { time: "now" });
  }, []);
  // here, we only push to the channel once on initial render
  // but when you push to the channel will vary across use cases

  return (
    <div>
      <h1>Time</h1>
      <div>
        {serverTime ? (
          serverTime
        ) : (
          <div>
            Loading...
          </div>
        )}
      </div>
    </div>
  );

}


export default function MyApp() {


  var initEmptyResource: Resource[] = []
  const [resources, setResources] = useState(initEmptyResource)

  return (
    <div>
      <h1>Welcome to Maca Bay</h1>
      <Buttons categories={Object.values(Category)} setResources={setResources} />
      <ResourceTable resources={resources} />

    </div>
  );
}

