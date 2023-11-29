import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type instState = {
    inst : boolean;
}


const initialState : instState= {
    inst : false,
}


const instSlice = createSlice({
    name : 'inst',
    initialState,
    reducers : {
        donwnLoadInst(state){
            
            state.inst = true
        },
      
        clearInst(state){
            
            state.inst = false;
        },
       
    },

});



export const {donwnLoadInst  ,clearInst } = instSlice.actions;

export default instSlice.reducer;