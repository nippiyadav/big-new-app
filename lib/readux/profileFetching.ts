import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";

export interface ArticleProps{
    blogImageUrl:string
    category:string
    createdAt:string
    description:string
    dislikes:number[]
    featuredImagealt:string
    likes:number[]
    public:boolean
    slug:string
    title:string
    updatedAt:string
    views:number
    _id:string
}

export interface ProfileProps{
    email:string;
    followerCount:number;
    fullname:string;
    isFollowing:boolean;
    ownerChannel:boolean;
    updatedAt:Date;
    username:string;
    _id:string;
    result:ArticleProps[]
}

let intialProfile:Partial<ProfileProps> = {};

const initialState = {
    loading:false,
    error:"",
    intialProfile
}

export const profileAsyncThunk = createAsyncThunk<ProfileProps,{profile:string}>(
    "profile",
    async ({profile},thunkApi)=>{
        try { 
            const response = await fetch(`/api/profile?profileName=${profile}`);
            const JsonResponse = await response.json();
            console.log("JosnResponse:- ",JsonResponse);
            return JsonResponse.data
        } catch (error) {
            console.log("Error in profileAsyncThunk:- ",error);
            thunkApi.rejectWithValue(`Error in ProfileAsyncThunk ${error}`)
        }
    }
)

const profileFetching = createSlice({
    name:"profile",
    initialState,
    reducers:{
        addingNewArticle:(state,payload)=>{
            let copyIntialResult = state.intialProfile.result;
            if (!copyIntialResult) {
                copyIntialResult = []
            };
            // console.log("payload:- ",payload);
            state.intialProfile.result = [...copyIntialResult,...payload.payload]
        }
    },
    extraReducers(builder) {
        builder.addCase(profileAsyncThunk.pending,(state,action)=>{
            state.loading = true,
            state.error = ""
        });
        builder.addCase(profileAsyncThunk.fulfilled,(state,action)=>{
            state.loading = false,
            state.intialProfile = action.payload
        });
        builder.addCase(profileAsyncThunk.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message??""
        })
    },
})

export const {addingNewArticle} = profileFetching.actions

export const profileFetchingData = profileFetching.reducer