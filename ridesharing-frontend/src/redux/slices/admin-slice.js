import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      
      const {
        search = '',
        sortBy = 'name',
        order = 'asc',
        page = 1,
        limit = 5
      } = params;

      
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (order) queryParams.append('order', order);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);

      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:3040/api/users/list?${queryParams.toString()}`, {
        headers: {
          Authorization: token
        }
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);




export const fetchPendingApprovals = createAsyncThunk('admin/fetchPendingApprovals', async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get("http://localhost:3040/api/cars/pending", {
    headers: {
      Authorization: token
    }
  })
  return response.data.filter(car => car.isApproved === false)


})
export const approveCarListing = createAsyncThunk('admin/approveCarListing',
  async (carId) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`http://localhost:3040/api/cars/${carId}/approve`, {}, {
      headers: {
        Authorization: token
      }
    })
    console.log("Approve Car Response:", response.data);
    return response.data
  }
)

export const fetchCars = createAsyncThunk('admin/fetchCars',
  async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3040/api/cars', {
      headers: {
        Authorization: token
      }
    })
    return response.data
  })

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    pendingApprovals: [],
    cars: [],
    loading: false,
    error: null,
    total:0,
    totalPages:0,
    page:1
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
        state.pendingApprovals = action.payload
      })
      .addCase(approveCarListing.pending, (state) => {
        state.loading = true
      })
      .addCase(approveCarListing.fulfilled, (state, action) => {
        state.loading = false

        
        if (action.payload.car && action.payload.car._id) {
          state.pendingApprovals = state.pendingApprovals.filter(
            car => car._id !== action.payload.car._id
          )

          
          state.cars = state.cars.map(car =>
            car._id === action.payload.car._id
              ? { ...car, isApproved: true }
              : car
          )
        }
      })
      .addCase(approveCarListing.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload; 
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }
})

export default adminSlice.reducer