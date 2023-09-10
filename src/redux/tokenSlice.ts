import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type TokenState = {
    accessToken : string | null,
    refreshToken : string | null,
}


const initialState : TokenState= {
    accessToken : null,
    refreshToken : null,
}


const tokenSlice = createSlice({
    name : 'token',
    initialState,
    reducers : {
        setAccessToken(state,action : PayloadAction<string>){
            
            state.accessToken = action.payload;
        },

        
        setRefreshToken(state,action : PayloadAction<string>){
            
            state.refreshToken = action.payload;;
        },


        deleteAccessToken(state){
            
            state.accessToken = "";
        },
        
        deleteRefreshToken(state){
            
            state.refreshToken = "";
        },

        
       
    },

});


export const getAccessToken = (state: { token: TokenState }) => state.token.accessToken;

export const {setAccessToken ,setRefreshToken ,deleteAccessToken,deleteRefreshToken } = tokenSlice.actions;

export default tokenSlice.reducer;