import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchTrips = createAsyncThunk("trips/fetchTrips", async () => {
  const response = await axios.get("http://localhost:3040/api/trip");
  console.log(response.data)
  return response.data;
});

export const getById = createAsyncThunk("trips/getById", async (id) => {
  const token = localStorage.getItem("token")
  const response = await axios.get(`http://localhost:3040/api/trip/${id}`,{
    headers:{
      Authorization:token
    }
  })
  
  console.log(response.data)
  return response.data
})

export const createTrip = createAsyncThunk("trips/createtrip",
  async (tripDetails) => {
    const token = localStorage.getItem('token')
    const response = await axios.post("http://localhost:3040/api/trip", tripDetails, {
      headers: {
        Authorization: token
      }
    })
    return response.data


  })
export const fetchMyTrips = createAsyncThunk('trips/fetchMyTrips', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get("http://localhost:3040/api/my-trips", {
    headers: {
      Authorization: token
    }
  });
  console.log(response.data)
  return response.data;
});



const tripSlice = createSlice({
  name: "trips",
  initialState: {
    loading: false,
    trips: [],
    error: null,
  },
  reducers: {
    clearTripError: (state) => {
      state.error = null;
    },
    clearTripSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
        state.error = null;
      })
      .addCase(fetchTrips.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch trips";
      })
      .addCase(createTrip.pending, (state) => {
        state.loading = true
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false
        state.trips = action.payload
        state.error = null
      })
      .addCase(createTrip.rejected, (state) => {
        state.loading = false
        state.error = "Failed to fetch trips"
      })
      .addCase(fetchMyTrips.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(fetchMyTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = Array.isArray(action.payload) ? action.payload : 
                     (action.payload && action.payload.trips ? action.payload.trips : []);
        console.log("Trips in state after update:", state.trips);
      })
      .addCase(fetchMyTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; 
      })
      
  },
});


export const {clearTripError , clearTripSuccess } = tripSlice.actions
export default tripSlice.reducer;
