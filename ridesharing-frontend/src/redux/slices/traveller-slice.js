import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";



export const updateTravellerProfile = createAsyncThunk('traveller/updateTravellerProfile', async ({ id, formData }) => {
    try {
        const response = await axios.put(`http://localhost:3040/api/traveller/${id}`, formData, { headers: { Authorization: localStorage.getItem('token') } })
        
        
        return response.data
    } catch (err) {
        console.log(err)
    }
})

export const getTravellerProfile = createAsyncThunk('traveller/getTravellerProfile',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:3040/api/traveller/${id}`, { headers: { Authorization: localStorage.getItem('token') } })
            localStorage.setItem("travellerProfile", JSON.stringify(response.data));
            console.log(response.data)
            return response.data
        } catch (err) {

            if (err.response && err.response.status === 404) {
                try {
                    const userResponse = await axios.get(`http://localhost:3040/api/users/${id}`, { headers: { Authorization: localStorage.getItem('token') } });
                    return userResponse.data; 
                } catch (error) {
                    return rejectWithValue(error.response?.data?.message || "User not found");
                }
            }
            return rejectWithValue(err.message || "An error occurred while fetching the profile")


        }
    }
)

const travellerSlice = createSlice({
    name: 'traveller',
    initialState: {
        loading: false,
        profile: null,
        data: null,
        error: null
    },
    reducers:{
        logoutTraveller: (state)=>{
            state.profile= null 
            state.data = null 
            localStorage.removeItem("travellerProfile")
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateTravellerProfile.fulfilled, (state, action) => {
                state.profile = action.payload
                localStorage.setItem("travellerProfile", JSON.stringify(action.payload))
            })
            .addCase(getTravellerProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTravellerProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                localStorage.setItem("travellerProfile", JSON.stringify(action.payload))
            })
            .addCase(getTravellerProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export const {logoutTraveller} = travellerSlice.actions
export default travellerSlice.reducer