import { useEffect, useState } from "react";
import { useParams } from "react-router";

export const GamePage = () => {
  const [game, setGame] = useState(null);
  const { game_id } = useParams();

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${game_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGame(data);
      })
      .catch(console.error);
  }, [game_id]);

  if (!game) {
    return <h1>Loading…</h1>;
  }

  return <h1>Game Page: ID {game.name}</h1>;
};
