import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("/api/audit/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setLogs(res.data);
      } catch (err) {
        message.error("Không thể tải log hoạt động");
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    {
      title: "Người dùng",
      dataIndex: "userId", // hoặc username nếu backend trả DTO đầy đủ
      key: "userId",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Thời gian",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (value) => dayjs(value).format("HH:mm DD/MM/YYYY"),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>📋 Log Hoạt Động</h2>
      <Table columns={columns} dataSource={logs} rowKey="id" />
    </div>
  );
};

export default AuditLogPage;
