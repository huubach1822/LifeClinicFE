import { configureStore } from '@reduxjs/toolkit'
import accountSlice from './slices/accountSlice'
import doctorSlice from './slices/doctorSlice'

export const store = configureStore({
    reducer: {
        accountSlice: accountSlice,
        doctorSlice: doctorSlice
    },
})