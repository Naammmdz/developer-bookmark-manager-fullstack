// src/pages/CollectionList.jsx

import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Popconfirm,
  message,
  Typography,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import CollectionService from '../services/CollectionService';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await CollectionService.getAllCollections();
      setCollections(res.data);
    } catch (error) {
      message.error('Lỗi khi tải collections');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await CollectionService.deleteCollection(id);
      message.success('Đã xoá thành công');
      fetchCollections();
    } catch (err) {
      message.error('Xoá thất bại');
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const columns = [
    {
      title: 'Tên bộ sưu tập',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Công khai',
      dataIndex: 'isPublic',
      render: (val) => (val ? '✅ Có' : '❌ Không'),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      render: (val) => dayjs(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/collections/${record.id}`)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/collections/${record.id}/edit`)}
          />
          <Popconfirm
            title="Xác nhận xoá?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>📚 Danh sách bộ sưu tập</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate('/collections/new')}
      >
        Tạo mới
      </Button>
      <Table
        columns={columns}
        dataSource={collections}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default CollectionList;
