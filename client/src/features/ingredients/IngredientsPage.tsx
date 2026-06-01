import { useState } from 'react';
import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  type TableProps,
} from 'antd';
import {
  useGetIngredientsQuery,
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
  type IngredientInput,
} from './ingredientsApi';
import { useGetEmployeesQuery } from '../employees/employeesApi';
import type { Ingredient } from '../../types';

export default function IngredientsPage() {
  const [search, setSearch] = useState<string>('');
  const { data: ingredients, isLoading } = useGetIngredientsQuery(
    search || undefined,
  );
  const { data: employees } = useGetEmployeesQuery();
  const [createIngredient] = useCreateIngredientMutation();
  const [updateIngredient] = useUpdateIngredientMutation();
  const [deleteIngredient] = useDeleteIngredientMutation();
  const { message } = App.useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [form] = Form.useForm<IngredientInput>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (record: Ingredient) => {
    setEditing(record);
    form.setFieldsValue({
      name: record.name,
      unit: record.unit ?? undefined,
      quantity: Number(record.quantity),
      employeeId: record.employeeId ?? undefined,
    });
    setModalOpen(true);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (editing) {
        await updateIngredient({ id: editing.id, data: values }).unwrap();
        message.success('Ингредиент обновлён');
      } else {
        await createIngredient(values).unwrap();
        message.success('Ингредиент добавлен');
      }
      setModalOpen(false);
    } catch {
      message.error('Не удалось сохранить');
    }
  };

  const onDelete = async (id: number) => {
    try {
      await deleteIngredient(id).unwrap();
      message.success('Удалено');
    } catch {
      message.error('Не удалось удалить');
    }
  };

  const columns: TableProps<Ingredient>['columns'] = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: 'Название', dataIndex: 'name' },
    { title: 'Ед. изм.', dataIndex: 'unit', render: (v: string) => v || '—' },
    { title: 'Количество', dataIndex: 'quantity' },
    {
      title: 'Ответственный',
      render: (_, r) => r.employee?.fullName ?? '—',
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
            title="Удалить ингредиент?"
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
        <Input.Search
          placeholder="Поиск по названию"
          allowClear
          onSearch={setSearch}
          style={{ width: 240 }}
        />
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        dataSource={ingredients}
        columns={columns}
      />

      <Modal
        title={editing ? 'Редактировать ингредиент' : 'Новый ингредиент'}
        open={modalOpen}
        onOk={onSubmit}
        onCancel={() => setModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Название"
            name="name"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Единица измерения" name="unit">
            <Input placeholder="кг, г, л, шт" />
          </Form.Item>
          <Form.Item label="Количество" name="quantity">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Ответственный сотрудник" name="employeeId">
            <Select
              allowClear
              placeholder="Не выбран"
              options={employees?.map((e) => ({
                value: e.id,
                label: e.fullName,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
