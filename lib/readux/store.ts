import {configureStore} from "@reduxjs/toolkit";
import { articleReducer } from "./articleFetchSlice";
import { articleSingleFetching } from "./singleArticleFetched";
import { authenticationFetching } from "./authFetching";
import  categoryfetching  from "./categoryFetching";

const store = configureStore({
    reducer:{
        article:articleReducer,
        singleArticle:articleSingleFetching,
        auth:authenticationFetching,
        category:categoryfetching
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store