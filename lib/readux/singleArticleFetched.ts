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
  isDisLiked:boolean;
  featuredImagealt: string;
  isFollowed:boolean;
  likes: number;
  isLiked:boolean;
  public: boolean;
  slug: string;
  title: string;
  updatedAt: string;
  views: number;
  _id: string;
}

export const singleArticleFetching = createAsyncThunk<
SingleArticleProps[],
  // Return type (void for now, adjust if you return anything)
  { id: string; slug: string }, // Argument type (id: string)
  { rejectValue: string } // Optional: Custom error handling type
>(
  "fetchArticle/singarticle",
  async (data: { id: string; slug: string }, thunkApi) => {
    try {
      console.log(data.id);

      const response = await fetch(`/api?id=${data.id}&single=yes`);

      if (response.ok) {
        const responseJson = await response.json();
        // console.log(responseJson);
        return responseJson; // You can return the responseJson if needed
      } else {
        return thunkApi.rejectWithValue("Failed to fetch the article");
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

const singleArticleFetch = createSlice({
  name: "singleArticle",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(singleArticleFetching.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(singleArticleFetching.fulfilled, (state, action) => {
        state.article = action.payload;
        state.loading = false;
      })
      .addCase(singleArticleFetching.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const articleSingleFetching = singleArticleFetch.reducer;
