import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Layout, Button, message, Typography } from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { get, put } from "../../utils/request";
import { dashboardStyles as styles } from "../dashboard/dashboardStyle.js";
import { CreateGameModal } from "../dashboard/CreateGameModal";
import { GameCardList } from "../dashboard/GameCardList";

export const GamePage = () => {
  const { Text } = Typography;
  const [games, setGames] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const navigate = useNavigate();
  const editBtnRef = useRef(null);
  // Controls the display and hide of the "Create Game" pop-up window.
  const [modalVisible, setModalVisible] = useState(false);

  const { game_id } = useParams();

  const fetchCurrentGame = async () => {
    try {
      const data = await get("/admin/games");
      if (data) {
        setGames(data.games);
        // get the current game
        const currentGame = data.games.find(
          (game) => game.id === parseInt(game_id)
        );
        if (currentGame) {
          setCurrentGame(currentGame);
        }
      }
    } catch (err) {
      message.error(err.message);
    }
  };
  useEffect(() => {
    fetchCurrentGame();
  }, [game_id]);

  // Create-game modal OK handler
  const handleEditGame = async (newGames) => {
    const data = { games: [...games, newGames] };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Create a game successfully");
        fetchCurrentGame();
      }
    } catch (err) {
      message.error(err.message);
    }
    setModalVisible(false);
    editBtnRef.current?.blur();
  };

  // Delete Game
  const handleDeleteQuestion = async (gameId) => {
    console.log("current game id is: ", gameId);
    const newGames = games.filter((game) => game.id !== gameId);
    const data = { games: newGames };
    try {
      const result = await put("/admin/games", data);
      if (result) {
        message.success("Delete the game successfully");
        fetchCurrentGame();
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Layout style={styles.container}>
      {/* Navbar */}
      <Layout.Header style={styles.header}>
        {/* Left */}
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          Back to Dashboard
        </Button>
        <Text style={{ fontSize: 24, fontWeight: 700, color: "#1677ff" }}>
          {currentGame.title}
        </Text>

        {/* Right: create button + user avatar/name + dropdown */}
        <div style={styles.actions}>
          <Button
            ref={editBtnRef}
            type="default"
            icon={<EditOutlined />}
            style={{
              color: "#1677ff",
              borderColor: "#1677ff",
              marginRight: 16,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#b9d6ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Edit Game
          </Button>
          <Button
            ref={editBtnRef}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginRight: 16 }}
            onClick={() => setModalVisible(true)}
            onMouseDown={(e) => e.preventDefault()}
          >
            Create Question
          </Button>
        </div>
      </Layout.Header>

      {/* Main content */}
      <Layout.Content style={styles.content}>
        <GameCardList
          games={currentGame.questions}
          onDelete={handleDeleteQuestion}
        />
        <CreateGameModal
          visible={modalVisible}
          onCreate={handleEditGame}
          onCancel={() => {
            setModalVisible(false);
            editBtnRef.current?.blur();
          }}
        />
      </Layout.Content>
    </Layout>
  );
};
