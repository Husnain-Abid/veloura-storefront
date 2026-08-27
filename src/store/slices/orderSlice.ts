import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  shippingAddress: any;
  items: any[];
}

interface OrderState {
  userOrders: Order[];
  adminOrders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  userOrders: [],
  adminOrders: [],
  loading: false,
  error: null,
};

export const fetchAdminOrders = createAsyncThunk('order/fetchAdminOrders', async () => {
  const response = await fetch('/api/admin/orders');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return await response.json();
});

export const fetchUserOrders = createAsyncThunk('order/fetchUserOrders', async () => {
  const response = await fetch('/api/orders/user');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return await response.json();
});

export const updateOrderStatusThunk = createAsyncThunk('order/updateOrderStatus', async ({ id, status }: { id: string, status: string }) => {
  const response = await fetch(`/api/admin/orders/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) throw new Error('Failed to update status');
  return { id, status };
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const adminOrder = state.adminOrders.find((o) => o.id === id);
        if (adminOrder) adminOrder.status = status;
        const userOrder = state.userOrders.find((o) => o.id === id);
        if (userOrder) userOrder.status = status;
      });
  },
});

export const { setLoading } = orderSlice.actions;
export default orderSlice.reducer;
