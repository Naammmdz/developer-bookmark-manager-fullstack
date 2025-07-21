// 📁 src/pages/CollectionPage.jsx
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const CollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form] = Form.useForm();

  const fetchCollections = async () => {
    const res = await axios.get("/api/collections", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setCollections(res.data);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleEdit = (record) => {
    setSelected(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/collections/${id}`);
    message.success("Xoá thành công");
    fetchCollections();
  };

  const handleFinish = async (values) => {
    if (selected) {
      await axios.put(`/api/collections/${selected.id}`, values);
      message.success("Cập nhật thành công");
    } else {
      await axios.post(`/api/collections`, values);
      message.success("Tạo mới thành công");
    }
    setModalVisible(false);
    setSelected(null);
    fetchCollections();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">📂 Quản lý Bộ sưu tập</h1>
      <Button onClick={() => setModalVisible(true)}>➕ Thêm Collection</Button>
      <Table
        dataSource={collections}
        columns={[
          { title: "Tên", dataIndex: "name" },
          { title: "Icon", dataIndex: "icon" },
          {
            title: "Hành động",
            render: (_, record) => (
              <>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>{" "}
                <Button danger onClick={() => handleDelete(record.id)}>
                  Xoá
                </Button>
              </>
            ),
          },
        ]}
        rowKey="id"
        style={{ marginTop: "20px" }}
      />
      <Modal
        title={selected ? "Sửa Collection" : "Thêm Collection"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelected(null);
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Tên bộ sưu tập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="Icon (ví dụ: 📁)">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CollectionPage;
