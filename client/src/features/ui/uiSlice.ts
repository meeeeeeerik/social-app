import { createSlice } from '@reduxjs/toolkit';
const uiSlice = createSlice({
  name: 'ui',
  initialState: { darkMode: localStorage.getItem('social_dark') !== 'false' },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('social_dark', String(state.darkMode));
    },
  },
});
export const { toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
