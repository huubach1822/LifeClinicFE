import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { getDoctorByAccount } from "../../service/doctorService";

export const doctorDetailRedux = createAsyncThunk(
    'doctorSlice/doctorDetailRedux',
    async (id, thunkAPI) => {
        const response = await getDoctorByAccount(id)
        return response.data
    },
)


const initialState = {
    doctor: {}
}

export const doctorSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        logoutDoctor(state) {
            state.doctor = {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(doctorDetailRedux.fulfilled, (state, action) => {
                state.doctor = action.payload.doctor;
            })
    },
})

export const { logoutDoctor } = doctorSlice.actions
export default doctorSlice.reducer