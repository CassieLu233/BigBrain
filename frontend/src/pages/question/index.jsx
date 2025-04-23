//=============================================================================
// File: question/index.jsx
// Purpose: The main page of editing question
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19
// ==============================================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Checkbox,
  Radio,
  message,
  Space,
  Layout,
  Typography,
  Divider,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { fileToDataUrl } from "../../utils/imageUtils";
import { dashboardStyles as styles } from "../dashboard/dashboardStyle";
import { getCurrentQuestion, updateCurrentQuestion } from "../../utils/update";

export const QuestionPage = () => {
  const navigate = useNavigate();
  const { Text } = Typography;
  const { gameId, questionId } = useParams();
  const [form] = Form.useForm();
  const [currentQuestion, setCurrentQustion] = useState([]);
  const [questionType, setQustionType] = useState("");
  const [uploadList, setUploadList] = useState([]);
  const initialAnswer = [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];

  // Handle image before upload
  const beforeUpload = async (file) => {
    try {
      const url = await fileToDataUrl(file);
      file.url = url;
      setUploadList([file]);
    } catch (err) {
      message.error(err.message);
    }
    // prevent default upload
    return false;
  };

  const handleRemoveThumbnail = () => {
    currentQuestion.image = "";
    setUploadList([]);
  };

  // Submit handler
  const handleFinish = async (values) => {
    try {
      // Build updatedAnswer answers
      let answers;
      if (values.type === "Judgement") {
        // Judgement only has two answers
        answers = [
          {
            text: "True",
            isCorrect: values.judgementAnswer === true,
          },
          {
            text: "False",
            isCorrect: values.judgementAnswer === false,
          },
        ];
      } else {
        answers = (values.answers || []).map((ans) => ({
          text: ans.text,
          isCorrect: !!ans.isCorrect,
        }));
      }

      const updatedQuestion = {
        ...values,
        id: Number(questionId),
        duration: values.duration,
        points: values.points,
        image: uploadList[0]?.url || currentQuestion.image || "",
        answers: answers,
      };
      const result = await updateCurrentQuestion(
        gameId,
        questionId,
        updatedQuestion
      );
      if (result) {
        message.success(
          "Editing the problem successfully, now return to the game page"
        );
        form.resetFields();
        navigate(`/game/${gameId}`);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleBackToGame = () => {
    form.resetFields();
    setUploadList([]);
    navigate(`/game/${gameId}`);
  };

  const initForm = async () => {
    try {
      const currentQuestion = await getCurrentQuestion(gameId, questionId);
      if (currentQuestion) {
        setCurrentQustion(currentQuestion);
        setQustionType(currentQuestion.type);

        // Ensure answers have at least two answer
        let answers = currentQuestion.answers || [];
        if (answers.length === 0) {
          answers = initialAnswer;
        }

        // Get correct option index of single choice
        const correctIndexs = answers
          .map((ans, idx) => (ans.isCorrect ? idx : -1))
          .filter((idx) => idx !== -1);

        const singleIdx =
          correctIndexs?.length === 1 ? correctIndexs[0] : undefined;

        // Get judgement answer
        let judgementValue = undefined;
        if (currentQuestion.type === "Judgement") {
          // Ensure answers is effective
          if (currentQuestion.answers.length > 0) {
            const correct = currentQuestion.answers.find(
              (ans) => ans.isCorrect
            );
            judgementValue = correct ? correct.text === "True" : undefined;
          }
        }

        // Set form initial values
        form.setFieldsValue({
          title: currentQuestion.title,
          type: currentQuestion.type,
          duration: currentQuestion.duration || 10,
          points: currentQuestion.points || 1,
          videoUrl: currentQuestion.videoUrl || undefined,
          answers: answers,
          singleIndex: singleIdx >= 0 ? singleIdx : undefined,
          judgementAnswer: judgementValue,
        });
        // If image exists, show in upload
        if (currentQuestion.image) {
          setUploadList([
            {
              uid: "-1",
              name: "image",
              status: "done",
              url: currentQuestion.image,
            },
          ]);
        }
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    initForm();
  }, [questionId]);

  return (
    <Layout style={styles.container}>
      {/* Navbar */}
      <Layout.Header style={styles.header}>
        {/* Left: Back to game btn and question title*/}
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={handleBackToGame}
        >
          Back to Game
        </Button>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#1677ff",
            whiteSpace: "nowrap",
            wordBreak: "break-word",
            overflow: "hidden",
          }}
          ellipsis={{ tooltip: currentQuestion.title }}
        >
          {currentQuestion.title}
        </Text>

        {/* Right: used to cente the question title*/}
        <div style={styles.actions}></div>
      </Layout.Header>

      {/* Main content */}
      <Layout.Content style={styles.content}>
        <Divider
          style={{
            margin: "0 0 16px",
            borderColor: "#e1e1e1",
            color: "#969696",
          }}
        >
          Question Information
        </Divider>
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={handleFinish}
        >
          <Form.Item
            name="title"
            label="Question"
            rules={[{ required: true, message: "Enter question text" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Question Type"
            rules={[{ required: true }]}
          >
            <Select
              onChange={(value) => {
                setQustionType(value);
                form.setFieldsValue({
                  answers:
                    form.getFieldValue("answers")?.length > 0
                      ? form.getFieldValue("answers")
                      : initialAnswer,
                });
              }}
            >
              <Select.Option value="Single Choice">Single Choice</Select.Option>
              <Select.Option value="Multiple Choice">
                Multiple Choice
              </Select.Option>
              <Select.Option value="Judgement">Judgement</Select.Option>
            </Select>
          </Form.Item>

          <Space align="baseline">
            <Form.Item
              name="duration"
              label="Time Limit (s)"
              rules={[{ required: true, type: "number", min: 1 }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="points"
              label="Points"
              rules={[{ required: true, type: "number", min: 0 }]}
            >
              <InputNumber />
            </Form.Item>
          </Space>

          <Form.Item name="videoUrl" label="YouTube URL (Option)">
            <Input placeholder="Optional video link" />
          </Form.Item>

          <Form.Item label="Image (Option)">
            <Upload
              listType="picture-card"
              fileList={uploadList.map((file) => ({
                uid: file.uid || file.name,
                name: file.name,
                status: "done",
                url: file.url,
              }))}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveThumbnail}
              showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
            >
              {uploadList.length === 0 && <PlusOutlined />}
            </Upload>
          </Form.Item>
          <Divider
            style={{
              margin: "0 0 16px",
              borderColor: "#e1e1e1",
              color: "#969696",
            }}
          >
            Edit Answers
          </Divider>
          {/* Judgement */}
          {questionType === "Judgement" ? (
            <Form.Item
              name="judgementAnswer"
              label="Answer"
              rules={[
                { required: true, message: "Please choose True or False" },
              ]}
            >
              <Radio.Group style={{ display: "flex", gap: 16 }}>
                <Radio value={true}>True</Radio>
                <Radio value={false}>False</Radio>
              </Radio.Group>
            </Form.Item>
          ) : (
            /* Single or Multiple Choice */
            <Form.List
              name="answers"
              rules={[
                {
                  validator: async (_, answers) => {
                    const type = form.getFieldValue("type");
                    if (type === "Judgement") return Promise.resolve();
                    if (!answers || !answers.some((a) => a.isCorrect)) {
                      return Promise.reject(
                        new Error("Please choose at least one correct answer!")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, idx) => {
                    const { key, name } = field;
                    return (
                      <div
                        key={key}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          marginBottom: 16,
                        }}
                      >
                        {/* Option Text */}
                        <Form.Item
                          name={[name, "text"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter option text",
                            },
                          ]}
                          style={{ flex: 1, minWidth: 10, margin: 0 }}
                        >
                          <Input placeholder={`Option ${idx + 1}`} />
                        </Form.Item>

                        {/* Option：Single vs Multiple */}
                        {questionType === "Single Choice" ? (
                          <Radio.Group
                            value={form.getFieldValue("singleIndex")}
                            onChange={(e) => {
                              const selectedIndex = e.target.value;
                              const answers =
                                form.getFieldValue("answers")?.length > 0
                                  ? form.getFieldValue("answers")
                                  : initialAnswer;
                              const updatedAnswer = answers.map((ans, i) => ({
                                ...ans,
                                isCorrect: i === selectedIndex,
                              }));
                              form.setFieldsValue({
                                answers: updatedAnswer,
                                singleIndex: selectedIndex,
                              });
                            }}
                            style={{ margin: "0 16px", flex: "0 0 auto" }}
                          >
                            <Radio value={idx}>Correct</Radio>
                          </Radio.Group>
                        ) : (
                          <Form.Item
                            name={[name, "isCorrect"]}
                            valuePropName="checked"
                            style={{ margin: "0 16px", flex: "0 0 auto" }}
                          >
                            <Checkbox>Correct</Checkbox>
                          </Form.Item>
                        )}

                        {/* Delete button */}
                        {fields.length > 2 && (
                          <Button danger onClick={() => remove(field.name)}>
                            Remove
                          </Button>
                        )}
                      </div>
                    );
                  })}

                  {/* Add answer button */}
                  {fields.length < 6 && (
                    <Form.Item key="add-answer">
                      <Button
                        type="dashed"
                        onClick={() => add({ text: "", isCorrect: false })}
                        block
                      >
                        Add Answer
                      </Button>
                    </Form.Item>
                  )}
                  {/* Render error information from Form.List */}
                  <div style={{ color: "red", marginBottom: 16 }}>
                    <Form.ErrorList errors={errors} />
                  </div>
                </>
              )}
            </Form.List>
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              Save Question
            </Button>
          </Form.Item>
        </Form>
      </Layout.Content>
    </Layout>
  );
};
