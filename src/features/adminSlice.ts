import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  menuButtonKey: "Inicio",
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setMenuButtonKey: (state, action) => {
      state.menuButtonKey = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMenuButtonKey } = adminSlice.actions;

export default adminSlice.reducer;