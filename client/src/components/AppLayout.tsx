import { Layout, Menu, Button, Typography, Space } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

const { Header, Content, Sider } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'admin';

  const items = [
    { key: '/ingredients', label: 'Ингредиенты' },
    ...(isAdmin
      ? [
          { key: '/employees', label: 'Сотрудники' },
          { key: '/users', label: 'Пользователи' },
        ]
      : []),
  ];

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          🥖 Пекарня
        </Typography.Title>
        <Space style={{ color: '#fff' }}>
          <span>
            {user?.login} ({user?.role})
          </span>
          <Button size="small" onClick={onLogout}>
            Выход
          </Button>
        </Space>
      </Header>
      <Layout>
        <Sider width={200} theme="light">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={items}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
