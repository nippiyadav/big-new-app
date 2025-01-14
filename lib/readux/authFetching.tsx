import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the user authentication properties
interface USERAUTHPROPS {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    isFollowed: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

// AsyncThunk for fetching authentication data from the backend
export const AuthFetchingBackend = createAsyncThunk<USERAUTHPROPS, void, { rejectValue: string }>(
    "auth/fetchBackend",
    async (_, thunkApi) => {
        try {
            const responseAuth = await fetch("/api?id=auth");
            if (responseAuth.ok) {
                const jsonObject = await responseAuth.json();
                console.log(jsonObject.data);
                return jsonObject.data as USERAUTHPROPS;
            } else {
                // Handle non-200 responses
                return thunkApi.rejectWithValue("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error in responseAuth:", error);
            return thunkApi.rejectWithValue("Something went wrong");
        }
    }
);


export const AuthLogOut = createAsyncThunk<void,void,{rejectValue:string}>(
    "logout/fetching",
   async (_,thunkApi)=>{
       try {
         const responseLogout = await fetch("/api?id=logout");
         if (responseLogout.ok) {
             const responseLogOut = await responseLogout.json();
             console.log(responseLogOut);
         }
       } catch (error) {
        console.log("Error:- ", error);
        return thunkApi.rejectWithValue("Something Went Wrong")
       }
    }
)

// Define the initial state structure
interface InitialStateProps {
    data: USERAUTHPROPS | null; // Make it nullable since initially, there might be no data
    loading: boolean;
    error: null | string;
}

const initialState: InitialStateProps = {
    data: null, // No user data initially
    loading: false,
    error: null,
};

// Create the slice for authentication fetching
const AuthFetching = createSlice({
    name: "auth",
    initialState,
    reducers: {}, // No manual reducers defined here since all logic is in extraReducers
    extraReducers: (builder) => {
        builder
            .addCase(AuthFetchingBackend.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(AuthFetchingBackend.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; // Store fetched user data
            })
            .addCase(AuthFetchingBackend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "An unknown error occurred";
            })

            .addCase(AuthLogOut.pending,(state)=>{
                state.error = null,
                state.loading = true
            })
            .addCase(AuthLogOut.fulfilled,(state)=>{
                state.loading = false
                state.data = null
            })
            .addCase(AuthLogOut.rejected,(state,action)=>{
                state.loading = false,
                state.error = action.payload || "An unknown error occurred"
            })
    },
});

// Export the reducer for store configuration
export const authenticationFetching = AuthFetching.reducer;

























// wrong code

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// interface USERAUTHPROPS {
//     _id: string;
//     username: string;
//     fullname: string;
//     email: string;
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
// }

// export const AuthFetchingBackend = createAsyncThunk<USERAUTHPROPS, void, { rejectValue: string }>("backendAuth",
//     async (_, thunkApi) => {
//         try {
//             const responseAuth = await fetch("/api?id=auth");
//             if (responseAuth.ok) {
//                 const jsonObject = await responseAuth.json();
//                 console.log(jsonObject.data);
//                 return jsonObject.data as USERAUTHPROPS
//             }
//         } catch (error) {
//             console.log("Error in the responseAuth", error);
//             return thunkApi.rejectWithValue("something went wrong")
//         }
//     }
// )

// interface InitialStateProps{
//     data: USERAUTHPROPS,
//     loading: boolean,
//     error: null | string
// }

// const initialState:InitialStateProps = {
//     data: ,
//     loading: false,
//     error: null
// }

// const AuthFetching = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(AuthFetchingBackend.pending, (state, action) => {
//                 state.error = null,
//                     state.loading = true
//             })
//             .addCase(AuthFetchingBackend.fulfilled, (state, action) => {
//                 state.loading = false,
//                     state.loading = action.payload
//             })
//             .addCase(AuthFetchingBackend.rejected, (state, action) => {
//                 state.loading = false,
//                     state.error = action.payload || null
//             })
//     }
// })

// export const authenticationFetching = AuthFetching.reducer