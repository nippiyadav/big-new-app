import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


interface CreateByData{
    _id:string;
    username:string;
    fullname:string;
}
export interface categoryFetchedData{
_id:string;
title:string;
createdBy:CreateByData;
featuredImagealt:string;
category:string;
slug:string;
description:string;
blogImageUrl:string;
createdAt:string;
}

export const fetchCategories = createAsyncThunk<categoryFetchedData[],{category:string},{rejectValue:string}>(
  "categories/fetchCategories",
  async (category,thunkApi) => {
    try {
        console.log("Category:- ",category);
        
        const response = await fetch(`/article/api?category=${category.category}`);
        if (response.ok) {
            const responseJson = await response.json();
            // console.log(responseJson);
            
            return responseJson.data as categoryFetchedData[];
        }else{
            return thunkApi.rejectWithValue("Internal Server Error");
        }
    } catch (error) {
        console.log("Error",error);
        
        return thunkApi.rejectWithValue("Internal Server Error");
    }
  }
);

interface CategoryState {
    data: any[];
    error: null | string;
    loading: boolean;
}

const initialState:CategoryState = {
    data: [],
    error: null,
    loading: false,
}

const categorySlice = createSlice({
    name:"categories",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchCategories.pending,(state)=>{
            state.loading = true;
        });
        builder.addCase(fetchCategories.fulfilled,(state,action)=>{
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(fetchCategories.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || null;
        });
    }
})

export default categorySlice.reducer;