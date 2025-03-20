import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const submitReview = createAsyncThunk('review/submitReview',
    async({tripId,ratings,comment},{rejectWithValue})=>{
        try{

            const token = localStorage.getItem('token')
            console.log("Submitting review:", { tripId, ratings, comment });
            const response = await axios.post('http://localhost:3040/api/review',{tripId,ratings,comment},{
                headers:{
                    Authorization:token
                }
    
            })
            return response.data
        }catch(error){
            console.error("Review API error:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Unknown error occurred");
    
        }
      
    }
)

export const fetchReviews = createAsyncThunk('review/fetchReviews',
    async(carOwnerId)=>{
        const response = await axios.get(`http://localhost:3040/api/review/${carOwnerId}`)
        return response.data

})

const reviewSlice = createSlice({
    name:'review',
    initialState:{
        review:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers :(builder)=>{
        builder
            .addCase(submitReview.pending,(state)=>{
                state.loading = true
                state.error = null
            })
            .addCase(submitReview.fulfilled,(state,action)=>{
                state.loading=false
                state.review.push(action.payload)
            })
            .addCase(submitReview.rejected ,(state,action)=>{
                state.loading = false
                state.error = action.payload || "failed to submit review"
            })
            .addCase(fetchReviews.fulfilled,(state,action)=>{
                state.review = action.payload
            })
    }
})

export default reviewSlice.reducer