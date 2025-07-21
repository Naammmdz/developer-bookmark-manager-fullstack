import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, message, DatePicker } from "antd";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const StatisticsPage = () => {
  const [stats, setStats] = useState({});
  const [topUsers, setTopUsers] = useState([]);
  const [topTags, setTopTags] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    fetchSummary();
    fetchTopData();
  }, [dateRange]);

  const fetchSummary = async () => {
    try {
      const res = await axios.get("/api/statistics/summary", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: getDateParams()
      });
      setStats(res.data);
    } catch {
      message.error("Không thể tải thống kê");
    }
  };

  const fetchTopData = async () => {
    try {
      const [userRes, tagRes] = await Promise.all([
        axios.get("/api/statistics/top-users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: getDateParams()
        }),
        axios.get("/api/statistics/top-tags", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          params: getDateParams()
        }),
      ]);
      setTopUsers(userRes.data);
      setTopTags(tagRes.data);
    } catch {
      message.error("Không thể tải biểu đồ");
    }
  };

  const getDateParams = () => {
    if (!dateRange[0] || !dateRange[1]) return {};
    return {
      startDate: dateRange[0].format("YYYY-MM-DD"),
      endDate: dateRange[1].format("YYYY-MM-DD")
    };
  };

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <h2>📊 Thống kê hệ thống</h2>
        <RangePicker
          value={dateRange}
          onChange={(range) => setDateRange(range)}
          allowClear
          placeholder={["Từ ngày", "Đến ngày"]}
        />
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="📑 Bookmark" value={stats.totalBookmarks || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="📁 Collection" value={stats.totalCollections || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="👤 Người dùng" value={stats.totalUsers || 0} /></Card></Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Card title="🏆 Top người dùng (Bookmark)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="username" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookmarkCount" fill="#8884d8" name="Số Bookmark" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="🏷️ Top Tag phổ biến">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTags}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Lượt dùng" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsPage;
