import { api } from '../../app/api';
import type { Ingredient } from '../../types';

export interface IngredientInput {
  name: string;
  unit?: string;
  quantity?: number;
  employeeId?: number | null;
}

export const ingredientsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIngredients: build.query<Ingredient[], string | void>({
      query: (search) =>
        `/ingredients${search ? `?search=${encodeURIComponent(search)}` : ''}`,
      providesTags: ['Ingredient'],
    }),
    createIngredient: build.mutation<Ingredient, IngredientInput>({
      query: (body) => ({ url: '/ingredients', method: 'POST', body }),
      invalidatesTags: ['Ingredient'],
    }),
    updateIngredient: build.mutation<
      Ingredient,
      { id: number; data: IngredientInput }
    >({
      query: ({ id, data }) => ({
        url: `/ingredients/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Ingredient'],
    }),
    deleteIngredient: build.mutation<void, number>({
      query: (id) => ({ url: `/ingredients/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Ingredient'],
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApi;
