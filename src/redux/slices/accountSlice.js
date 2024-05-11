import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser, registerUser, changePassword } from '../../service/accountService'

export const registerRedux = createAsyncThunk(
    'accountSlice/registerRedux',
    async (user, thunkAPI) => {
        const response = await registerUser(user)
        return response.data
    },
)

export const loginRedux = createAsyncThunk(
    'accountSlice/loginRedux',
    async (user, thunkAPI) => {
        const response = await loginUser(user)
        return response.data
    },
)

export const changePwRedux = createAsyncThunk(
    'accountSlice/changePwRedux',
    async (user, thunkAPI) => {
        const response = await changePassword(user)
        return response.data
    }
)

const initialState = {
    account: {}
}

export const accountSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        logoutAccount(state) {
            state.account = {}
            localStorage.setItem('user_account', JSON.stringify({}));
        },
        setAccount(state, action) {
            state.account = action.payload
            localStorage.setItem('user_account', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerRedux.fulfilled, (state, action) => {
                state.account = action.payload.account;
                localStorage.setItem('user_account', JSON.stringify(action.payload.account));
            })
            .addCase(loginRedux.fulfilled, (state, action) => {
                state.account = action.payload.account;
                localStorage.setItem('user_account', JSON.stringify(action.payload.account));
            })
            .addCase(changePwRedux.fulfilled, (state, action) => {
                if (action.payload.code === 0) {
                    state.account = action.payload.account;
                    localStorage.setItem('user_account', JSON.stringify(action.payload.account));
                }
            })
    },
})

export const { logoutAccount, setAccount } = accountSlice.actions
export default accountSlice.reducer