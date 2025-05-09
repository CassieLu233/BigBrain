// ==============================================================================
// File: question/index.jsx
// Purpose: The main page of editing question (fully styled-components version)
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19, Refactored: 2025-05-09
// ==============================================================================

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { message, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  StyledForm,
  StyledInput,
  StyledInputNumber,
  StyledSelect,
  StyledUpload,
  StyledCheckbox,
  StyledRadioGroup,
  StyledDivider,
  StyledText,
  BackButton,
  DangerButton,
  DashedButton,
  PrimaryButton,
  PageContainer,
  PageHeader,
  PageContent,
  InlineFlex,
  AnswerItem,
  ErrorBox,
} from "styles";
import {
  fileToDataUrl,
  getCurrentQuestion,
  updateCurrentQuestion,
} from "utils";

export const QuestionPage = () => {
  const navigate = useNavigate();
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

      // Create correctAnswers
      let correctAnswers = [];
      answers.forEach((answer, index) => {
        if (answer.isCorrect) {
          correctAnswers.push(index);
        }
      });

      const updatedQuestion = {
        ...values,
        id: Number(questionId),
        duration: values.duration,
        points: values.points,
        image: uploadList[0]?.url || currentQuestion.image || "",
        answers: answers,
        correctAnswers: correctAnswers,
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
    <PageContainer>
      <PageHeader>
        <BackButton onClick={handleBackToGame}>Back to Game</BackButton>
        <StyledText ellipsis={{ tooltip: currentQuestion.title }}>
          {currentQuestion.title}
        </StyledText>
      </PageHeader>

      <PageContent>
        <StyledDivider>Question Information</StyledDivider>
        <StyledForm form={form} layout="vertical" onFinish={handleFinish}>
          <StyledForm.Item
            name="title"
            label="Question"
            rules={[{ required: true, message: "Enter question text" }]}
          >
            <StyledInput />
          </StyledForm.Item>

          <StyledForm.Item
            name="type"
            label="Question Type"
            rules={[{ required: true }]}
          >
            <StyledSelect
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
              <StyledSelect.Option value="Single Choice">
                Single Choice
              </StyledSelect.Option>
              <StyledSelect.Option value="Multiple Choice">
                Multiple Choice
              </StyledSelect.Option>
              <StyledSelect.Option value="Judgement">
                Judgement
              </StyledSelect.Option>
            </StyledSelect>
          </StyledForm.Item>

          <InlineFlex>
            <StyledForm.Item
              name="duration"
              label="Time Limit (s)"
              rules={[{ required: true, type: "number", min: 1 }]}
            >
              <StyledInputNumber />
            </StyledForm.Item>
            <StyledForm.Item
              name="points"
              label="Points"
              rules={[{ required: true, type: "number", min: 0 }]}
            >
              <StyledInputNumber />
            </StyledForm.Item>
          </InlineFlex>

          <StyledForm.Item name="videoUrl" label="YouTube URL (Option)">
            <StyledInput placeholder="Optional video link" />
          </StyledForm.Item>

          <StyledForm.Item label="Image (Option)">
            <StyledUpload
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
            </StyledUpload>
          </StyledForm.Item>

          <StyledDivider>Edit Answers</StyledDivider>

          {questionType === "Judgement" ? (
            <StyledForm.Item
              name="judgementAnswer"
              label="Answer"
              rules={[
                { required: true, message: "Please choose True or False" },
              ]}
            >
              <StyledRadioGroup style={{ display: "flex", gap: 16 }}>
                <StyledRadioGroup.Button value={true}>
                  True
                </StyledRadioGroup.Button>
                <StyledRadioGroup.Button value={false}>
                  False
                </StyledRadioGroup.Button>
              </StyledRadioGroup>
            </StyledForm.Item>
          ) : (
            <StyledForm.List
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
                  {fields.map((field, idx) => (
                    <AnswerItem key={field.key}>
                      <StyledForm.Item
                        name={[field.name, "text"]}
                        rules={[
                          {
                            required: true,
                            message: "Please enter option text",
                          },
                        ]}
                        style={{ flex: 1, margin: 0 }}
                      >
                        <StyledInput placeholder={`Option ${idx + 1}`} />
                      </StyledForm.Item>

                      {questionType === "Single Choice" ? (
                        <StyledRadioGroup
                          value={form.getFieldValue("singleIndex")}
                          onChange={(e) => {
                            const selectedIndex = e.target.value;
                            const answers = form.getFieldValue("answers") || [];
                            const updated = answers.map((ans, i) => ({
                              ...ans,
                              isCorrect: i === selectedIndex,
                            }));
                            form.setFieldsValue({
                              answers: updated,
                              singleIndex: selectedIndex,
                            });
                          }}
                          style={{ margin: "0 16px", flex: "0 0 auto" }}
                        >
                          <StyledRadioGroup.Button value={idx}>
                            Correct
                          </StyledRadioGroup.Button>
                        </StyledRadioGroup>
                      ) : (
                        <StyledForm.Item
                          name={[field.name, "isCorrect"]}
                          valuePropName="checked"
                          style={{ margin: "0 16px", flex: "0 0 auto" }}
                        >
                          <StyledCheckbox>Correct</StyledCheckbox>
                        </StyledForm.Item>
                      )}

                      {fields.length > 2 && (
                        <DangerButton onClick={() => remove(field.name)}>
                          Remove
                        </DangerButton>
                      )}
                    </AnswerItem>
                  ))}

                  {fields.length < 6 && (
                    <StyledForm.Item key="add">
                      <DashedButton
                        onClick={() => add({ text: "", isCorrect: false })}
                        block
                      >
                        Add Answer
                      </DashedButton>
                    </StyledForm.Item>
                  )}

                  <ErrorBox>
                    <StyledForm.ErrorList errors={errors} />
                  </ErrorBox>
                </>
              )}
            </StyledForm.List>
          )}

          <StyledForm.Item>
            <PrimaryButton htmlType="submit">Save Question</PrimaryButton>
          </StyledForm.Item>
        </StyledForm>
      </PageContent>
    </PageContainer>
  );
};
