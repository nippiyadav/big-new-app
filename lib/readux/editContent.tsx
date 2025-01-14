import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SingleArticleCreatedBy {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    isFollowed: boolean;
}

export interface SingleArticleProps {
    blogImageUrl: string;
    category: string;
    content: string;
    createdAt: string;
    createdBy: SingleArticleCreatedBy;
    description: string;
    dislikes: number;
    isDisLiked: boolean;
    featuredImagealt: string;
    isFollowed: boolean;
    likes: number;
    isLiked: boolean;
    public: boolean;
    slug: string;
    title: string;
    updatedAt: string;
    views: number;
    _id: string;
}

export const singleArticleEditFetching = createAsyncThunk<
    SingleArticleProps[],
    // Return type (void for now, adjust if you return anything)
    { id: string;}, // Argument type (id: string)
    { rejectValue: string } // Optional: Custom error handling type
>(
    "fetchArticle/singarticle",
    async (data: { id: string; }, thunkApi) => {
        try {
            const response = await fetch(`/edit/content/api?contentId=${data.id}&content=Get`);

            if (response.ok) {
                const jsonConverted = await response.json();
                console.log(jsonConverted);
                if (jsonConverted?.data[0]) {
                    return jsonConverted?.data[0]
                }
                else {
                    return thunkApi.rejectWithValue("Failed to fetch the article");
                }
            }
        } catch (error) {
            console.log("Error in articleSingleFetching", error);
            return thunkApi.rejectWithValue("Error occurred during fetching");
        }
    }
);

interface InitiaStateProps {
    article: SingleArticleProps[];
    error: string | null;
    loading: boolean;
}
const initialState: InitiaStateProps = {
    article: [],
    error: null,
    loading: false,
};

const singleArticleEditFetch = createSlice({
    name: "singleArticle",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(singleArticleEditFetching.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(singleArticleEditFetching.fulfilled, (state, action) => {
                state.article = action.payload;
                state.loading = false;
            })
            .addCase(singleArticleEditFetching.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || null;
            });
    },
});

export const articleSingleEditFetching = singleArticleEditFetch.reducer;
