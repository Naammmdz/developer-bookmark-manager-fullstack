// src/pages/CollectionDetail.jsx

import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  List,
  Button,
  Space,
  Tag,
  Modal,
  message,
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import CollectionService from '../services/CollectionService';
import BookmarkService from '../services/BookmarkService';
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  StarFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const CollectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    loadCollection();
  }, [id]);

  const loadCollection = async () => {
    try {
      const res = await CollectionService.getCollectionById(id);
      setCollection(res.data);

      const bm = await BookmarkService.getBookmarksByCollectionId(id);
      setBookmarks(bm.data);
    } catch (err) {
      message.error('Lỗi khi tải chi tiết bộ sưu tập');
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Xóa bộ sưu tập?',
      content: 'Thao tác này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      onOk: async () => {
        try {
          await CollectionService.deleteCollection(id);
          message.success('Đã xóa');
          navigate('/collections');
        } catch {
          message.error('Không thể xóa');
        }
      },
    });
  };

  if (!collection) return null;

  return (
    <div style={{ padding: 24 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
        Quay lại
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={4}>
            <span style={{ marginRight: 8 }}>📁</span>
            {collection.name}
          </Title>
          <Text type="secondary">{collection.description}</Text>
          <Text>
            👁️ Trạng thái:{" "}
            <Tag color={collection.isPublic ? 'green' : 'red'}>
              {collection.isPublic ? 'Công khai' : 'Riêng tư'}
            </Tag>
          </Text>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            style={{ marginTop: 8 }}
          >
            Xóa bộ sưu tập
          </Button>
        </Space>
      </Card>

      <Card title="📌 Danh sách Bookmark" style={{ marginTop: 24 }}>
        <List
          itemLayout="vertical"
          dataSource={bookmarks}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              extra={<img src={item.favicon} alt="" width={24} />}
              actions={[
                item.isFavorite && (
                  <Tag color="gold" icon={<StarFilled />}>
                    Yêu thích
                  </Tag>
                ),
              ]}
            >
              <List.Item.Meta
                title={<a href={item.url}>{item.title}</a>}
                description={item.description}
              />
              {item.tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default CollectionDetail;
