// src/pages/CollectionForm.jsx

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Switch,
  Card,
  message,
  Typography,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CollectionService from '../services/CollectionService';

const { Title } = Typography;

const CollectionForm = () => {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id && id !== 'new') {
      setIsEdit(true);
      CollectionService.getCollectionById(id)
        .then((res) => {
          form.setFieldsValue(res.data);
        })
        .catch(() => message.error('Không thể tải dữ liệu'));
    }
  }, [id]);

  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await CollectionService.updateCollection(id, values);
        message.success('Cập nhật thành công');
      } else {
        await CollectionService.createCollection(values);
        message.success('Tạo mới thành công');
      }
      navigate('/collections');
    } catch (error) {
      message.error('Lỗi khi lưu dữ liệu');
    }
  };

  return (
    <Card style={{ maxWidth: 600, margin: '0 auto', marginTop: 32 }}>
      <Title level={4}>
        {isEdit ? '✏️ Chỉnh sửa bộ sưu tập' : '➕ Tạo bộ sưu tập mới'}
      </Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên bộ sưu tập"
          name="name"
          rules={[{ required: true, message: 'Nhập tên bộ sưu tập' }]}
        >
          <Input placeholder="VD: Lưu trữ học tập" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea placeholder="Ghi chú mô tả..." />
        </Form.Item>

        <Form.Item
          label="Biểu tượng"
          name="icon"
          rules={[{ required: true, message: 'Nhập tên icon' }]}
        >
          <Input placeholder="VD: book, star, tag" />
        </Form.Item>

        <Form.Item
          label="Công khai"
          name="isPublic"
          valuePropName="checked"
          initialValue={true}
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate('/collections')}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CollectionForm;
