//=============================================================================
// File: game/CreateGameModal.jsx
// Purpose: Modal for creating a new game
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { useState } from "react";
import { Modal, Form, Input, Upload, message, Segmented, Button } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { fileToDataUrl } from "utils";

export const CreateGameModal = ({ title, visible, onCreate, onCancel }) => {
  const [mode, setMode] = useState("form");
  const hasExternalTitle = Boolean(title);
  const [form] = Form.useForm();
  const [thumbList, setThumbList] = useState([]);

  // Record csv/json file
  const [fileList, setFileList] = useState([]);
  const [parsedGame, setParsedGame] = useState(null);

  // Processing function after the user selects the image
  const handleBeforeUploadThumb = async (file) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      // Uese base64 file to preview
      file.thumbUrl = dataUrl;
      setThumbList([file]);
    } catch (err) {
      message.error(err.message);
    }
    return false;
  };

  // Delete thumbnail
  const handleRemoveThumbnail = () => {
    setThumbList([]);
  };

  const checkValidFile = (games) => {
    // The root must be a non-empty array
    if (!Array.isArray(games) || games.length === 0) {
      throw new Error("The JSON root should be a non-empty array of games");
    }

    games.forEach((game, gameIdx) => {
      // Each game must have a title and a questions array
      if (typeof game.title !== "string" || !Array.isArray(game.questions)) {
        throw new Error(
          `Game ${gameIdx + 1} is missing a title or questions array`
        );
      }
      game.questions.forEach((question, questionIdx) => {
        // Each question must have id/title/type/duration/points/answers/correctAnswers
        if (typeof question.id !== "number") {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } is missing id or has invalid type`
          );
        }
        if (typeof question.title !== "string") {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } is missing title or has invalid type`
          );
        }
        if (
          !["Single Choice", "Multiple Choice", "Judgement"].includes(
            question.type
          )
        ) {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } has an invalid type`
          );
        }
        if (
          typeof question.duration !== "number" ||
          typeof question.points !== "number"
        ) {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } is missing duration/points or has invalid type`
          );
        }
        if (question.image && typeof question.image !== "string") {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } image must be a base64 string or URL`
          );
        }
        if (question.videoUrl && typeof question.videoUrl !== "string") {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } videoUrl must be a base64 string or URL`
          );
        }
        if (!Array.isArray(question.answers) || question.answers.length < 2) {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } must have at least two answers`
          );
        }
        if (
          !Array.isArray(question.correctAnswers) ||
          question.correctAnswers.length === 0
        ) {
          throw new Error(
            `Game ${gameIdx + 1}, question ${
              questionIdx + 1
            } is missing correctAnswers`
          );
        }
      });
    });
  };

  // JSON/CSV Upload
  const handleBeforeUploadData = async (file) => {
    // Only JSON is allowed
    if (!file.name.match(/\.(json)$/i)) {
      message.error("Please upload a JSON file");
      return Upload.LIST_IGNORE;
    }
    try {
      const text = await file.text();
      const games = JSON.parse(text);
      checkValidFile(games);
      // Validation passed
      setParsedGame(games);
      setFileList([file]);
      message.success(
        "Game data loaded successfully; it will be created upon confirmation"
      );
    } catch (err) {
      message.error("Failed to parse game JSON: " + err.message);
    }
    return false;
  };

  const handleRemoveData = () => {
    setFileList([]);
    setParsedGame(null);
  };

  const reset = () => {
    form.resetFields();
    setThumbList([]);
    setFileList([]);
    setParsedGame(null);
  };

  // handle submit event
  const handleOk = async () => {
    // Check the existence of file
    if (mode === "json" && parsedGame) {
      onCreate(parsedGame);
      reset();
      return;
    }

    try {
      const values = await form.validateFields();
      const owner = localStorage.getItem("email") || "anonymity";
      const updateTime = new Date().toISOString();
      let imageBase64 = "";
      if (thumbList[0]) {
        // thumbList[0].thumbUrl is base64 type
        imageBase64 = thumbList[0].thumbUrl;
      }
      const newGameData = [
        {
          image: imageBase64,
          title: values.title || "",
          description: values.description || "",
          owner: owner,
          updateTime: updateTime,
          questions: [],
        },
      ];
      onCreate(newGameData);
      reset();
      setThumbList([]);
    } catch (err) {
      // When verification or conversion fails, AntD will display a form error
      // other errors are prompted
      if (!err.errorFields) {
        message.error(err.message);
      }
    }
  };

  // Reset the state when switching modes
  const handleModeChange = (value) => {
    setMode(value);
    reset();
  };

  return (
    <Modal
      title={title || "Create New Game"}
      open={visible}
      onOk={() => form.submit()}
      onCancel={() => {
        reset();
        onCancel();
      }}
      okButtonProps={{
        disabled: !hasExternalTitle && mode === "json" && fileList.length === 0,
      }}
      destroyOnClose
    >
      {/* If there is no external title, the toggle button will appear */}
      {!hasExternalTitle && (
        <Segmented
          options={[
            { label: "Manual Input", value: "form" },
            { label: "JSON Upload", value: "json" },
          ]}
          value={mode}
          onChange={handleModeChange}
          style={{ marginBottom: 16 }}
        />
      )}

      {!hasExternalTitle && mode === "json" ? (
        // JSON Upload
        <Form layout="vertical" preserve={false} onFinish={handleOk}>
          <Form.Item label="Upload Games JSON">
            <Upload
              accept=".json"
              beforeUpload={handleBeforeUploadData}
              onRemove={handleRemoveData}
              fileList={fileList.map((f) => ({
                uid: f.uid || f.name,
                name: f.name,
                status: "done",
              }))}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
              }}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Select Json File</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      ) : (
        // Manual Input
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          onFinish={handleOk}
        >
          <Form.Item label="Thumbnail (JPEG/PNG/SVG)">
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={handleBeforeUploadThumb}
              onRemove={handleRemoveThumbnail}
              fileList={thumbList.map((f) => ({
                uid: f.uid || f.name,
                name: f.name,
                status: "done",
                url: f.thumbUrl,
              }))}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
              }}
            >
              {thumbList.length === 0 && <PlusOutlined />}
            </Upload>
          </Form.Item>
          <Form.Item
            name="title"
            label="Game Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Description" />
          </Form.Item>

          <button type="submit" style={{ display: "none" }} />
        </Form>
      )}
    </Modal>
  );
};
