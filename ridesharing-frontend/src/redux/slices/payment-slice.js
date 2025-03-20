import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createPayment = createAsyncThunk('/payments/createPayment', async (paymentData, { rejectWithValue }) => {
    console.log(paymentData)
    try {
        const response = await axios.post('http://localhost:3040/api/payments/checkout', paymentData)
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data?.errors || 'Payment failed')
    }
})

export const updatePaymentStatus = createAsyncThunk('/payments/updatePaymentStatus', async ({ stripeId }, { rejectWithValue }) => {
    try {
        console.log(stripeId)
        const response = await axios.put(`http://localhost:3040/api/payments/${stripeId}/success`, { paymentStatus: 'succeeded' })
        console.log(response.data)
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data?.errors || 'Status update failed')
    }
})

export const getAllPayments = createAsyncThunk('payments/getAllPayments', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:3040/api/getAllPayments')
        return response.data
    } catch (err) {
        console.log(err)
        return rejectWithValue(err.response?.data?.errors || 'Failed to fetch payments')
    }
})

const paymentSlice = createSlice({
    name: "payments",
    initialState: {
        data: null,
        allPayments: [],
        error: null,
        loading: false,
        serverError: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Payment creation failed';
            })
            .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                state.loading = false;
                
            })
            .addCase(getAllPayments.fulfilled, (state, action) => {
                state.loading = false;
                state.allPayments = action.payload;
            });
    }
})

export default paymentSlice.reducer;