//=============================================================================
// File: question/CreateQuestionModal.jsx
// Purpose: Modal for adding a new question (text + type only)
// Author: Qian Lu
// Course: COMP6080
// Created: 2025-04-19
//=============================================================================
import { Modal, Form, Input, Select, message } from "antd";

export const CreateQuestionModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      // values = { title: "...", type: "single" | "multiple" | "judgement" }
      const values = await form.validateFields();
      console.log("create question modal return:", values);
      onCreate(values);
      form.resetFields();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <Modal
      title="Add Question"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      okText="Add"
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false} onFinish={handleOk}>
        <Form.Item
          name="title"
          label="Question"
          rules={[
            { required: true, message: "Please enter the question title" },
          ]}
        >
          <Input placeholder="Enter question..." />
        </Form.Item>
        <Form.Item
          name="type"
          label="Question Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <Select placeholder="Select type">
            <Select.Option value="Single Choice">Single Choice</Select.Option>
            <Select.Option value="Multiple Choice">
              Multiple Choice
            </Select.Option>
            <Select.Option value="Judgement">Judgement</Select.Option>
          </Select>
        </Form.Item>
        <button type="submit" style={{ display: "none" }} />
      </Form>
    </Modal>
  );
};
