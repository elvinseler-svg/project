import { App, Button, Card, Form, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from './authApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './authSlice';

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = async (values: { login: string; password: string }) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials(res));
      navigate('/ingredients');
    } catch {
      message.error('Неверный логин или пароль');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          🥖 Пекарня
        </Typography.Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: 'Введите логин' }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Войти
          </Button>
        </Form>
      </Card>
    </div>
  );
}
