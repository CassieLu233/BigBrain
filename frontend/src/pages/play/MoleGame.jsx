// MoleGame.jsx
import { useState, useEffect, useRef } from "react";
import { Spin, Typography } from "antd";
import Img from "../../assets/rabbit.svg";
import ImgHit from "../../assets/rabbitHit.svg"; // 鼹鼠被击中图
const { Text } = Typography;

export const MoleGame = () => {
  const [holes, setHoles] = useState(
    Array(16).fill({ visible: false, hit: false })
  );
  const [score, setScore] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Generate a function that randomly displays rabbits
    const showRandomMole = () => {
      const idx = Math.floor(Math.random() * 16);

      setHoles((prevHoles) => {
        const newHoles = prevHoles.map((cell, i) => {
          if (i === idx) {
            // Default setting
            return { visible: true, hit: false };
          }
          // Have not been hit, return
          if (cell.visible) {
            return cell;
          }
          // Invisible, set not hit
          return { visible: false, hit: false };
        });
        return newHoles;
      });

      // After 800ms, hide all unhit moles
      setTimeout(() => {
        setHoles((prevHoles) => {
          const newHoles = prevHoles.map((cell) => {
            if (cell.visible && !cell.hit) {
              return { visible: false, hit: false };
            }
            return cell;
          });
          return newHoles;
        });
      }, 800);
    };

    intervalRef.current = setInterval(showRandomMole, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleClick = (i) => {
    setHoles((hole) => {
      // No rabbit or hitted, return
      if (!hole[i].visible || hole[i].hit) return hole;

      // Have rabbit and hitted, change value
      const next = [...hole];
      next[i] = { visible: true, hit: true };
      return next;
    });
    setScore((s) => s + 1);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#fafafa",
      }}
    >
      {/* Header */}
      <div
        style={{
          flex: "0 0 80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Spin style={{ marginRight: 8 }} />
          <Text strong style={{ fontSize: 20, color: "#1677ff" }}>
            Please wait for the start...
          </Text>
        </div>
        <Text strong style={{ fontSize: 20, color: "green", marginRight: 16 }}>
          Score: {score}
        </Text>
      </div>

      {/* 4 x 4 */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: 10,
          padding: 20,
        }}
      >
        {holes.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: cell.visible && !cell.hit ? "pointer" : "default",
            }}
          >
            {cell.visible && (
              <img
                src={cell.hit ? ImgHit : Img}
                alt="mole"
                style={{
                  width: "80%",
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
