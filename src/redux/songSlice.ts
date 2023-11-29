import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export type SongState = {
    songURL : string | null | undefined;
}

const initialState : SongState = {
    songURL : null,
}

const songSlice = createSlice({
    name : 'song',
    initialState,
    reducers : {
        setSongSlice(state, action : PayloadAction<string>){
            state.songURL = action.payload;
        },
        clearSongSlice(state){
            state.songURL = null;
        }
    }
})

export const {setSongSlice , clearSongSlice} = songSlice.actions;
export default songSlice.reducer;