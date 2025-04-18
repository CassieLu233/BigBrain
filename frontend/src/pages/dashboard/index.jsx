import { Button, Row, Avatar, Card, message } from "antd";
import { Link, useNavigate } from "react-router";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";
import { isLogin } from "../../utils/auth";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { Meta } = Card;
  const goLoginPage = () => {
    // ToDo check the validity of login
    navigate("/login");
  };
  const goRegisterPage = () => {
    // ToDo check the validity of form
    navigate("/register");
  };

  useEffect(() => {
    const loginStatus = isLogin();
    if (!loginStatus) {
      // not logged in, go to login page
      message.warning(
        "No user login was detected, the login page is loaded for you",
        0.5,
        () => {
          navigate("/login");
        }
      );
    }
  }, []);
  // Initialize to determine whether to log in
  return (
    <>
      <h1>Dashboard Page</h1>
      <Row>
        <Button onClick={goLoginPage}>Go LoginPage</Button>
        <Button onClick={goRegisterPage}>Go RegisterPage</Button>
      </Row>
      <Card
        style={{ width: 300 }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <Meta
          avatar={
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          }
          title={<Link to="/game/1">Game1</Link>}
          description="This is the description"
        />
      </Card>
    </>
  );
};
