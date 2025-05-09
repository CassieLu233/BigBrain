// ==============================================================================
// File: question/CreateQuestionModal.jsx
// Purpose: Modal for adding a new question (fully styled-components version)
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-19, Refactored: 2025-05-09
// ==============================================================================

import { message, Form } from "antd";
import {
  StyledModal,
  StyledForm,
  StyledInput,
  StyledSelect,
  HiddenSubmitButton,
} from "styles";

export const CreateQuestionModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      // values = { title: "...", type: "Single Choice" | "Multiple Choice" | "Judgement" }
      const values = await form.validateFields();
      onCreate(values);
      form.resetFields();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <StyledModal
      title="Add Question"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Add"
    >
      <StyledForm form={form} preserve={false} onFinish={handleOk}>
        <StyledForm.Item
          name="title"
          label="Question"
          rules={[
            { required: true, message: "Please enter the question title" },
          ]}
        >
          <StyledInput placeholder="Enter question..." />
        </StyledForm.Item>

        <StyledForm.Item
          name="type"
          label="Question Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <StyledSelect placeholder="Select type">
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

        <HiddenSubmitButton type="submit" />
      </StyledForm>
    </StyledModal>
  );
};
