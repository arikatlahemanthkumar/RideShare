import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBookings = createAsyncThunk("bookings/fetchBookings", async () => {
    try {
        const response = await axios.get("http://localhost:3040/api/booking");
        console.log(response.data);
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
});

export const createBooking = createAsyncThunk(
    "bookings/createBooking",
    async (bookingDetails, { rejectWithValue }) => {
        console.log("Booking Details:", bookingDetails);
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post("http://localhost:3040/api/booking", bookingDetails, {
                headers: {
                    Authorization: token
                }
            });
            console.log(response.data);
            return response.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response?.data?.errors || "Something went wrong");
        }
    }
);

export const fetchUserBookings = createAsyncThunk(
    "bookings/fetchUserBookings",
    async (userId, { rejectWithValue }) => {
        console.log("Fetching bookings for traveller ID:", userId);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return rejectWithValue("No authentication token found");
            }

            const response = await axios.get(`http://localhost:3040/api/bookings/user/${userId}`, {
                headers: {
                    Authorization: token,
                }
            });

            console.log("Traveller-specific bookings fetched:", response.data);
            return response.data;
        } catch (err) {
            console.log("Error fetching traveller bookings:", err);
            return rejectWithValue(err.response?.data?.errors || "Failed to fetch traveller bookings");
        }
    }
);





const bookingSlice = createSlice({
    name: "bookings",
    initialState: {
        loading: false,
        bookings: [],
        currentBooking: null,
        error: null,
    },
    reducers: {
        setCurrentBooking: (state, action) => {
            state.currentBooking = action.payload
        },
        clearCurrentBooking: (state, action) => {
            state.currentBooking = null
        },
        clearErrors: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
                state.currentBooking = action.payload
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create booking";
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                console.log("Fetched Bookings:", action.payload); 
                state.bookings = action.payload;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.error = action.error.message;
            });
    }
});


export const { setCurrentBooking, clearCurrentBooking, clearErrors } = bookingSlice.actions
export default bookingSlice.reducer;
