import {configureStore} from "@reduxjs/toolkit";
import { articleReducer } from "./articleFetchSlice";
import { articleSingleFetching } from "./singleArticleFetched";
import { authenticationFetching } from "./authFetching";
import  categoryfetching  from "./categoryFetching";
import {profileFetchingData} from "./profileFetching"
import {articleSingleEditFetching} from "./editContent"

const store = configureStore({
    reducer:{
        article:articleReducer,
        singleArticle:articleSingleFetching,
        auth:authenticationFetching,
        category:categoryfetching,
        edit:articleSingleEditFetching,
        profileFetching:profileFetchingData
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store