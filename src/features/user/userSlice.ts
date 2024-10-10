import { user } from '@/types/data'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  currentUser: user | null
}

const initialState: UserState = {
  currentUser: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addCurrentUser: (state, action: PayloadAction<user>) => {
      state.currentUser = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { addCurrentUser } = userSlice.actions

export default userSlice.reducer
