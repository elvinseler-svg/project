import { useState } from 'react';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
} from 'antd';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  type UserInput,
} from './usersApi';
import type { Role, User } from '../../types';

const roleOptions = [
  { value: 'admin', label: 'Администратор' },
  { value: 'user', label: 'Пользователь' },
];

interface UserFormValues {
  login: string;
  password?: string;
  role: Role;
}

export default function UsersPage() {
  const { data: users, isLoading } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form] = Form.useForm<UserFormValues>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ role: 'user' });
    setModalOpen(true);
  };

  const openEdit = (record: User) => {
    setEditing(record);
    form.resetFields();
    form.setFieldsValue({ login: record.login, role: record.role });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    const payload: UserInput = { login: values.login, role: values.role };
    if (values.password) payload.password = values.password;
    try {
      if (editing) {
        await updateUser({ id: editing.id, data: payload }).unwrap();
        message.success('Пользователь обновлён');
      } else {
        await createUser(payload).unwrap();
        message.success('Пользователь добавлен');
      }
      setModalOpen(false);
    } catch {
      message.error('Не удалось сохранить (возможно, логин занят)');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteUser(id).unwrap();
      message.success('Удалено');
    } catch {
      message.error('Не удалось удалить');
    }
  };

  const columns: TableProps<User>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'Логин', dataIndex: 'login' },
    {
      title: 'Роль',
      dataIndex: 'role',
      render: (role: Role) => (
        <Tag color={role === 'admin' ? 'gold' : 'blue'}>
          {role === 'admin' ? 'Администратор' : 'Пользователь'}
        </Tag>
      ),
    },
    {
      title: 'Действия',
      width: 220,
      render: (_, r) => (
        <Space>
          <Button size="small" onClick={() => openEdit(r)}>
            Редактировать
          </Button>
          <Popconfirm
            title="Удалить пользователя?"
            onConfirm={() => onDelete(r.id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button size="small" danger>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={openCreate}>
          Добавить
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={users}
        columns={columns}
      />

      <Modal
        title={editing ? 'Редактировать пользователя' : 'Новый пользователь'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: 'Введите логин' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: !editing, message: 'Введите пароль' },
              { min: 3, message: 'Минимум 3 символа' },
            ]}
            extra={
              editing ? 'Оставьте пустым, чтобы не менять пароль' : undefined
            }
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Роль"
            name="role"
            rules={[{ required: true, message: 'Выберите роль' }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
