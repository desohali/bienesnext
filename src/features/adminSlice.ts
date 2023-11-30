import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  menuButtonKey: "Rifas",
  openFormRifa: false
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setMenuButtonKey: (state, action) => {
      state.menuButtonKey = action.payload;
    },
    setOpenFormRifa: (state, action) => {
      state.openFormRifa = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMenuButtonKey, setOpenFormRifa } = adminSlice.actions;

export default adminSlice.reducer;