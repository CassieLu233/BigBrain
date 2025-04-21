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
  const { game_id, question_id } = useParams();
  const [form] = Form.useForm();
  const [currentQuestion, setCurrentQustion] = useState([]);
  const [questionType, setQustionType] = useState("");
  const [uploadList, setUploadList] = useState([]);
  const initialAnswer = [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ];

  const initForm = async () => {
    try {
      const currentQuestion = await getCurrentQuestion(game_id, question_id);
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
  }, [question_id]);

  return <Layout style={styles.container}></Layout>;
};
