//=============================================================================
// File: dashboard/CreateGameModal.jsx
// Purpose: Modal for creating a new game
// Author: Qian Lu (z5506082@ad.unsw.edu.au)
// Course: COMP6080
// Created: 2025-04-18
// ==============================================================================
import { useState } from "react";
import { Modal, Form, Input, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fileToDataUrl } from "../../utils/imageUtils.js";
import logoImg from "../../assets/bigbrain.svg";

/**
 * CreateGameModal
 * Props:
 *  - visible: boolean
 *  - onCreate:  (data: { games: { image, title, description, owner, updateTime } }) => void
 *  - onCancel: () => void
 */
export const CreateGameModal = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  const [uploadFileList, setUploadFileList] = useState([]);

  // Processing function after the user selects the image
  const handleBeforeUpload = async (file) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      // Uese base64 file to preview
      file.thumbUrl = dataUrl;
      setUploadFileList([file]);
    } catch (err) {
      message.error(err.message);
    }
    return false;
  };

  // Delete thumbnail
  const handleRemoveThumbnail = () => {
    setUploadFileList([]);
  };

  // handle submit event
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const owner = window.localStorage.getItem("email") || "anonymity";
      const updateTime = new Date().toISOString();
      let imageBase64 = "";
      if (uploadFileList[0]) {
        // uploadFileList[0].thumbUrl is base64 type
        imageBase64 = uploadFileList[0].thumbUrl;
      } else {
        const defaultFile = logoImg;
        const response = await fetch(defaultFile);
        const svgBlob = await response.blob();
        const defaultFileBase64 = await fileToDataUrl(svgBlob);
        imageBase64 = defaultFileBase64;
      }
      const newGameData = {
        image: imageBase64,
        title: values.title,
        description: values.description || "No Description",
        owner: owner,
        updateTime: updateTime,
        questions: [],
      };
      onCreate(newGameData);
      form.resetFields();
      setUploadFileList([]);
    } catch (err) {
      // When verification or conversion fails, AntD will display a form error
      // other errors are prompted
      if (!err.errorFields) {
        message.error(err.message);
      }
    }
  };

  return (
    <Modal
      title="Create New Game"
      open={visible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        setUploadFileList([]);
        onCancel();
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item label="Thumbnail (JPEG/PNG/SVG)">
          <Upload
            listType="picture-card"
            maxCount={1}
            multiple={false}
            fileList={uploadFileList.map((file) => ({
              uid: file.uid || file.name,
              name: file.name,
              status: "done",
              url: file.thumbUrl,
            }))}
            beforeUpload={handleBeforeUpload}
            onRemove={handleRemoveThumbnail}
            showUploadList={{
              showPreviewIcon: false,
              showDownloadIcon: false,
              showRemoveIcon: true,
            }}
          >
            {uploadFileList.length === 0 && <PlusOutlined />}
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
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
