import { useState } from 'react';
import {
  App,
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  type TableProps,
} from 'antd';
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  type EmployeeInput,
} from './employeesApi';
import type { Employee } from '../../types';

export default function EmployeesPage() {
  const { data: employees, isLoading } = useGetEmployeesQuery();
  const [createEmployee] = useCreateEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form] = Form.useForm<EmployeeInput>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Employee) => {
    setEditing(record);
    form.setFieldsValue({
      fullName: record.fullName,
      position: record.position ?? undefined,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await updateEmployee({ id: editing.id, data: values }).unwrap();
        message.success('Сотрудник обновлён');
      } else {
        await createEmployee(values).unwrap();
        message.success('Сотрудник добавлен');
      }
      setModalOpen(false);
    } catch {
      message.error('Не удалось сохранить');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteEmployee(id).unwrap();
      message.success('Удалено');
    } catch {
      message.error('Не удалось удалить');
    }
  };

  const columns: TableProps<Employee>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'ФИО', dataIndex: 'fullName' },
    {
      title: 'Должность',
      dataIndex: 'position',
      render: (v: string) => v || '—',
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
            title="Удалить сотрудника?"
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
        dataSource={employees}
        columns={columns}
      />

      <Modal
        title={editing ? 'Редактировать сотрудника' : 'Новый сотрудник'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="ФИО"
            name="fullName"
            rules={[{ required: true, message: 'Введите ФИО' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Должность" name="position">
            <Input placeholder="Пекарь, кассир, ..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
