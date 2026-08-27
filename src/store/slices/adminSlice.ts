import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface AdminStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStockItems: number;
}

interface AdminState {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  loading: false,
  error: null,
};

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async () => {
  const response = await fetch('/api/admin/stats');
  if (!response.ok) throw new Error('Failed to fetch stats');
  return await response.json();
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error';
      });
  },
});

export default adminSlice.reducer;
