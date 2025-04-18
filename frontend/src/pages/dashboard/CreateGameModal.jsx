//=============================================================================
// File: dashboard/CreateGameModal.jsx
// Purpose: Modal for creating a new game
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { Modal, Form, Input } from "antd";

/**
 * CreateGameModal
 * Props:
 *  - visible: 是否显示弹窗
 *  - onCreate: 点击 OK 时回调 (values) => void
 *  - onCancel: 点击 Cancel 时回调 () => void
 */
export const CreateGameModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
        form.resetFields();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Create New Game"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="title"
          label="Game Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
