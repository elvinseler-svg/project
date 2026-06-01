import { api } from '../../app/api';
import type { Employee } from '../../types';

export interface EmployeeInput {
  fullName: string;
  position?: string;
}

export const employeesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getEmployees: build.query<Employee[], void>({
      query: () => '/employees',
      providesTags: ['Employee'],
    }),
    createEmployee: build.mutation<Employee, EmployeeInput>({
      query: (body) => ({ url: '/employees', method: 'POST', body }),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: build.mutation<
      Employee,
      { id: number; data: EmployeeInput }
    >({
      query: ({ id, data }) => ({
        url: `/employees/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Employee'],
    }),
    deleteEmployee: build.mutation<void, number>({
      query: (id) => ({ url: `/employees/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Employee'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeesApi;
