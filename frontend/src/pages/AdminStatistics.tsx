// 📁 src/pages/AdminStatistics.tsx
import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col, Spin } from "antd";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const { Title, Text } = Typography;

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const AdminStatistics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/statistics/summary");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Lỗi khi tải thống kê:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <Title level={3} className="text-white">📊 Thống kê hệ thống</Title>
      <Text type="secondary" className="text-white/70">Hiển thị biểu đồ Top Users, Tags, ...</Text>

      {loading ? (
        <Spin tip="Đang tải dữ liệu..." className="mt-6 text-white" />
      ) : (
        <Row gutter={24} className="mt-6">
          <Col xs={24} md={12}>
            <Card title="Top 5 người dùng có nhiều bookmark" className="rounded-xl shadow">
              <BarChart width={400} height={300} data={summary?.topUsers || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="bookmarkCount" fill="#8884d8" name="Số bookmark" />
              </BarChart>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Tỷ lệ các loại Tag" className="rounded-xl shadow">
              <PieChart width={400} height={300}>
                <Pie
                  data={summary?.tagDistribution || []}
                  dataKey="count"
                  nameKey="tag"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {summary?.tagDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default AdminStatistics;
