import { createSlice , createAsyncThunk, } from "@reduxjs/toolkit";
import axios from "axios"

export const addCar = createAsyncThunk('cars/addCar',
    async(carDetails)=>{
        let token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:3040/api/cardetails',carDetails,{
            headers:{
                Authorization:token
            }
        })
        return response.data
    }

)

export const fetchMyCars = createAsyncThunk('cars/fetchMyCars', async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get("http://localhost:3040/api/my-cars", {
        headers: {
            Authorization: token
        }
    });
    return response.data; 
});

const carSlice = createSlice({
    name:'cars',
    initialState:{
        cars:[],
        loading:false,
        error:null,
        currentCar:null,
        success :false,
    },
    reducers:{
        clearCarError : (state)=>{
            state.error = null 
        },
        clearCarSuccess:(state)=>{
            state.success = false
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(addCar.pending,(state)=>{
                state.loading = true
                state.error = null
                state.success=false
            })
            .addCase(addCar.fulfilled,(state,action)=>{
                state.loading = false
                state.cars.push(action.payload)
                state.success=true
            })
            .addCase(addCar.rejected,(state,action)=>{
                state.loading = false
                state.error = action.error.message
                state.success = false
            })

            .addCase(fetchMyCars.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = Array.isArray(action.payload) ? action.payload : 
                    (action.payload && action.payload.cars ? action.payload.cars : []);
                 console.log("Cars in state after update:", state.cars);
            })
            .addCase(fetchMyCars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; 
                console.error("Cars fetch rejected:", action.payload);
            });
    }
})


export const {clearCarError ,clearCarSuccess} =carSlice.actions
export default carSlice.reducer