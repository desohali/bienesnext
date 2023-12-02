import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  menuButtonKey: "Rifas",
  openFormRifa: false,
  listaDeRifas: [],
  rifaDetalles: null,
  isRifa: false
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
    setListaDeRifas: (state, action) => {
      state.listaDeRifas = action.payload;
    },
    setIsRifa: (state, action) => {
      state.isRifa = action.payload;
    },
    setRifaDetalles: (state, action) => {
      state.rifaDetalles = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setMenuButtonKey,
  setOpenFormRifa,
  setListaDeRifas,
  setIsRifa,
  setRifaDetalles
} = adminSlice.actions;

export default adminSlice.reducer;