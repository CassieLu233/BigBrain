import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { message } from "antd";
import { get } from "../../utils/request";

export const GamePage = () => {
  const [game, setGame] = useState(null);
  const { game_id } = useParams();

  useEffect(() => {
    get(`https://jsonplaceholder.typicode.com/users/${game_id}`)
      .then((data) => {
        setGame(data);
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, [game_id]);

  if (!game) {
    return <h1>Loading…</h1>;
  }

  return <h1>Game Page: {game.name}</h1>;
};
