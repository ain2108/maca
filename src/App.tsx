
import './App.css';

import { useState } from 'react'

import { Button, IconButton } from '@mui/material';

enum Category {
  Games = "Games",
  Books = "Books",
  Films = "Films",
  Paintings = "Paintings",
  Links = "Links",
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

type Resource = {
  title: string;
  category: Category;
}

function MyButton({ setResources, category }: { setResources: React.Dispatch<React.SetStateAction<Resource[]>>, category: Category }) {

  function handleClick(): void {
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

