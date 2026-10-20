import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FiBox, FiShoppingCart, FiTag, FiUsers, FiRefreshCw } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { AdminAPI_Config } from '../../Config/AdminAPI-Config';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTranslation } from 'react-i18next';

const MAIN_COLOR = '#f13b63';
const COLORS = [MAIN_COLOR, '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4'];

function normalizeCollection(response) {
  const root = response?.data ?? response;
  const items = Array.isArray(root) ? root
    : Array.isArray(root?.data) ? root.data
      : Array.isArray(root?.data?.data) ? root.data.data
        : Array.isArray(response?.data?.data?.data) ? response.data.data.data : [];
  const totalCandidates = [root?.total, root?.meta?.total, root?.data?.total, response?.meta?.total, response?.total];
  const total = totalCandidates.find((value) => value !== undefined && value !== null && Number.isFinite(Number(value)));
  return { items, total: total === undefined ? items.length : Number(total) };
}

const StatCard = ({ icon, value, label, color }) => (
  <Card className="border-0 shadow-sm rounded-4 h-100">
    <Card.Body className="d-flex align-items-center gap-3">
      <div className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0" style={{ width: '55px', height: '55px', backgroundColor: color }}>{icon}</div>
      <div><h3 className="fw-bold mb-0">{value}</h3><span className="text-muted small">{label}</span></div>
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const { adminToken } = useAdminAuth();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ products: 0, orders: 0, categories: 0, customers: '—' });
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const fetchDashboard = useCallback(async () => {
    if (!adminToken) { setLoading(false); return; }
    setLoading(true);
    setError('');
    const headers = { Accept: 'application/json', Authorization: `Bearer ${adminToken}` };
    try {
      const endpoints = [
        AdminAPI_Config.ENDPOINTS.PRODUCT,
        AdminAPI_Config.ENDPOINTS.ORDER,
        AdminAPI_Config.ENDPOINTS.CATEGORY,
      ];
      const responses = await Promise.all(endpoints.map(async (endpoint) => {
        const response = await fetch(`${AdminAPI_Config.BASE_URL}/${endpoint}?page=1&per_page=${endpoint === AdminAPI_Config.ENDPOINTS.ORDER ? 100 : 1000}&_=${Date.now()}`, {
          headers,
          cache: 'no-store',
        });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(json?.message || `تعذر تحميل ${endpoint}`);
        return normalizeCollection(json);
      }));
      const [productsResult, ordersResult, categoriesResult] = responses;
      const products = productsResult.items;
      const orders = ordersResult.items;
      const categories = categoriesResult.items;

      setStats({
        products: productsResult.total,
        orders: ordersResult.total,
        categories: categoriesResult.total,
        // No customer endpoint is configured in this project, so do not display a fabricated count.
        customers: '—',
      });

      const recentOrders = [...orders].slice(0, 7).reverse();
      setLineData(recentOrders.map((order, index) => ({
        name: order.order_number || order.number || `#${order.id || index + 1}`,
        sales: Number(order.total ?? order.total_price ?? order.amount ?? 0) || 0,
      })));

      const statusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'Pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      setBarData(Object.entries(statusCounts).map(([name, count]) => ({ name, count })));

      const categoryCounts = new Map();
      products.forEach((product) => {
        const categoryId = String(product.category_id ?? product.category?.id ?? 'other');
        categoryCounts.set(categoryId, (categoryCounts.get(categoryId) || 0) + 1);
      });
      const pie = categories.map((category) => ({
        name: i18n.language === 'ar'
          ? (category.ar?.name || category.name || category.en?.name || `#${category.id}`)
          : (category.en?.name || category.name || category.ar?.name || `#${category.id}`),
        value: category.products_count !== undefined ? Number(category.products_count) : (categoryCounts.get(String(category.id)) || 0),
      })).filter((item) => item.value > 0);
      if (categoryCounts.has('other')) pie.push({ name: 'Other / Uncategorized', value: categoryCounts.get('other') });
      setPieData(pie);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'تعذر تحديث لوحة التحكم.');
    } finally {
      setLoading(false);
    }
  }, [adminToken, i18n.language]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
    const refresh = () => fetchDashboard();
    window.addEventListener('admin:data-changed', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('admin:data-changed', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [fetchDashboard]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" style={{ color: MAIN_COLOR }} /><p className="mt-3">Loading Dashboard...</p></div>;

  return (
    <div className="p-1">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <h3 className="fw-bold m-0">Dashboard Overview</h3>
        <Button variant="light" className="border d-flex align-items-center gap-2" onClick={fetchDashboard}><FiRefreshCw /> Refresh</Button>
      </div>
      {error && <div className="alert alert-warning" role="alert">{error} <button className="btn btn-sm btn-link" onClick={fetchDashboard}>Try again</button></div>}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} xl={3}><StatCard icon={<FiBox size={24} />} value={stats.products} label="Total Products" color="#3b82f6" /></Col>
        <Col xs={12} sm={6} xl={3}><StatCard icon={<FiShoppingCart size={24} />} value={stats.orders} label="Total Orders" color={MAIN_COLOR} /></Col>
        <Col xs={12} sm={6} xl={3}><StatCard icon={<FiTag size={24} />} value={stats.categories} label="Categories" color="#f59e0b" /></Col>
        <Col xs={12} sm={6} xl={3}><StatCard icon={<FiUsers size={24} />} value={stats.customers} label="Customers" color="#10b981" /></Col>
      </Row>

      <Row className="g-4">
        <Col xs={12} lg={8}>
          <Card className="border-0 shadow-sm rounded-4 h-100"><Card.Body>
            <h5 className="fw-bold mb-4">Total Sales (Recent Orders)</h5>
            <div style={{ width: '100%', height: 300 }}>
              {lineData.length ? <ResponsiveContainer><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /><Line type="monotone" dataKey="sales" stroke={MAIN_COLOR} strokeWidth={3} dot={{ r: 4, fill: MAIN_COLOR }} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer> : <EmptyChart message="No order sales data is available yet." />}
            </div>
          </Card.Body></Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card className="border-0 shadow-sm rounded-4 h-100"><Card.Body>
            <h5 className="fw-bold mb-4">Products by Category</h5>
            <div style={{ width: '100%', height: 300 }}>
              {pieData.length ? <ResponsiveContainer><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">{pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend verticalAlign="bottom" height={36} iconType="circle" /></PieChart></ResponsiveContainer> : <EmptyChart message="No category product counts are available yet." />}
            </div>
          </Card.Body></Card>
        </Col>
        <Col xs={12}>
          <Card className="border-0 shadow-sm rounded-4"><Card.Body>
            <h5 className="fw-bold mb-4">Orders Status</h5>
            <div style={{ width: '100%', height: 300 }}>
              {barData.length ? <ResponsiveContainer><BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: 'rgba(241,59,99,0.05)' }} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} /><Bar dataKey="count" fill={MAIN_COLOR} radius={[6, 6, 0, 0]} barSize={50} /></BarChart></ResponsiveContainer> : <EmptyChart message="No order status data is available yet." />}
            </div>
          </Card.Body></Card>
        </Col>
      </Row>
    </div>
  );
};

const EmptyChart = ({ message }) => <div className="h-100 d-flex justify-content-center align-items-center text-center text-muted small px-3">{message}</div>;
export default AdminDashboard;
