
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// lib/redux/articleFetchSlice.ts

export interface CreatedAuthor{
    username:string,
    fullname:string,
    email?:string
}

export interface Article {
    createdAt: string;
    updatedAt: string;
    createdBy: CreatedAuthor;
    blogImageUrl: string;
    featuredImagealt: string;
    category: string;
    title:string,
    description:string,
    views: number;
    likes: number[];
    dislikes: number[];
    public: boolean;
    slug: string;
    content: string;
    _id:string;
}


// New interface for the response structure
export interface FetchedArticlesResponse {
    articles: Article[]; // Regular articles
    trending: Article[]; // Trending articles
  }

export const articleAsyncFetching = createAsyncThunk<FetchedArticlesResponse, void, { rejectValue: string }>(
    "article/articleFetching",
    async (_, thunkApi) => {
        try {
            const response = await fetch("/api?id=homePage"); // Fetch from the API route

            // console.log(response);
            
            if (!response.ok) throw new Error("Failed to fetch articles");
            const data = await response.json();
            console.log("Fetched Articles:", data);
            return data[0] as FetchedArticlesResponse;
        } catch (error) {
            console.log("Error in fetching value",error);
            return thunkApi.rejectWithValue("Failed to fetch articles");
        }
    }
);




interface ArticleState {
    article: Article[]; // Regular articles
    trending: Article[]; // Trending articles
    error: string | null;
    loading: boolean;
}

const initialState: ArticleState = {
    article: [], // Regular articles
    trending: [], // Trending articles
    error: null,
    loading: false,
};

export const fetchArticle = createSlice({
    name:"article",
    initialState,
    reducers:{},
    extraReducers: (builder)=> {
        builder
        .addCase(articleAsyncFetching.pending,(state)=>{
            state.error = null;
            state.loading = true;
        })
        .addCase(articleAsyncFetching.fulfilled,(state,action)=>{
            state.loading = false;
            state.article = action.payload.articles; // Populate articles
            state.trending = action.payload.trending; // Populate trending
        })
        .addCase(articleAsyncFetching.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || null;
        })

    },
})

export const articleReducer = fetchArticle.reducer










































































// this for getting in single response from the server
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// // lib/redux/articleFetchSlice.ts

// export interface CreatedAuthor{
//     username:string,
//     fullname:string,
//     email:string
// }

// export interface Article {
//     createdAt: string;
//     updatedAt: string;
//     createdBy: CreatedAuthor;
//     blogImageUrl: string;
//     featuredImagealt: string;
//     category: string;
//     title:string,
//     description:string,
//     views: number;
//     likes: number[];
//     dislikes: number[];
//     public: boolean;
//     slug: string;
//     content: string;
//     _id:string;
// }


// export const articleAsyncFetching = createAsyncThunk<Article[], void, { rejectValue: string }>(
//     "article/articleFetching",
//     async (_, thunkApi) => {
//         try {
//             const response = await fetch("/api"); // Fetch from the API route

//             // console.log(response);
            
//             if (!response.ok) throw new Error("Failed to fetch articles");
//             const data = await response.json();
//             console.log("Fetched Articles:", data);
//             return data as Article[];
//         } catch (error) {
//             console.log("Error in fetching value",error);
//             return thunkApi.rejectWithValue("Failed to fetch articles");
//         }
//     }
// );




// interface ArticleState {
//     article: Article[];
//     error: string | null;
//     loading: boolean;
// }

// const initialState: ArticleState = {
//     article: [],
//     error: null,
//     loading: false,
// };

// export const fetchArticle = createSlice({
//     name:"article",
//     initialState,
//     reducers:{},
//     extraReducers: (builder)=> {
//         builder
//         .addCase(articleAsyncFetching.pending,(state,action)=>{
//             state.error = null;
//             state.loading = true;
//         })
//         .addCase(articleAsyncFetching.fulfilled,(state,action)=>{
//             state.loading = false;
//             state.article = action.payload;
//         })
//         .addCase(articleAsyncFetching.rejected,(state,action)=>{
//             state.loading = false;
//             state.error = action.payload || null;
//         })

//     },
// })

// export const articleReducer = fetchArticle.reducer