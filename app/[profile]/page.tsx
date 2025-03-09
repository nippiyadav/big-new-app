"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { addingNewArticle, ArticleProps, profileFetchingData } from '@/lib/readux/profileFetching';
import { profileAsyncThunk } from '@/lib/readux/profileFetching';
import { useDispatch, UseDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/readux/store';
import AvatarComponents from '../components/AvatarComponents';
import Image from 'next/image';
import BlogContainer from '../components/BlogContainer';
import { FilePenLine, LucideDelete, Trash2 } from 'lucide-react';
import Link from 'next/link';

function ProfilePage() {
    const [category, setCategory] = useState<string[]>([]);
    const [activecategory,setActiveCategory] = useState<string>("")

    const [categoryArticles, setCategoryArticles] = useState<ArticleProps[]>([]);

    const { profile } = useParams();
    const dispatch = useDispatch<AppDispatch>();

    // dataExtracting
    const { error, intialProfile, loading } = useSelector((state: RootState) => state.profileFetching);
    console.log("intialProfile:- ", intialProfile);

    console.log("Profile:- ", profile);
    // this useEffect is running when where profile of user change to show its articles
    useEffect(() => {
        const response = async () => {
            if (!profile || profile instanceof Array) {
                return
            }
            dispatch(profileAsyncThunk({ profile }))
        }
        response();
    }, [profile]);

    // this useEffect run for knowing how many category is present of user
    useEffect(() => {
        const response = async () => {
            let category = intialProfile.result?.reduce((prevState, currValue) => {
                if (!prevState.includes(currValue.category)) {
                    prevState.push(currValue.category);
                    // console.log("prevState:- ",prevState);               
                }
                return prevState
            }, [] as string[]);
            console.log("category:- ", category);

            if (!category) {
                category = []
            } else {
                category = category
            }
            setCategory(category)
        }
        response()
    }, [intialProfile?._id]);

    // this is for updating the article in components on the basis of category, which button user click
    useEffect(()=>{
        categoryArticleShower(category[0]);
        setActiveCategory(category[0])
    },[category])
    const categoryArticleShower = async (category: string) => {
        console.log("category:- ", category);
        let filterCategory = intialProfile.result?.filter((data, index) => data.category === category);
        if (!filterCategory) {
            filterCategory = []
        } else {
            filterCategory = filterCategory
        }
        console.log(filterCategory);
        setCategoryArticles(filterCategory);
    }

    // deleting the Artilce
    const deleteArticle = async (id: string) => {
        try {
            console.log("deleting articleId:- ", id);

            const response = await fetch(`/api/articleDelete?deleteId=${id}`);
            const responseJson = await response.json();
            console.log("responseJson:- ", responseJson);
        } catch (error) {
            console.log("Error in the deleteArticle");

        }
    }

    // more article and adding that in the readux
    const moreArticle = async () => {
        try {
            const activecategoryArticle = activecategory;
            const totalArticle = categoryArticles.length
            // console.log("activecategoryArticle:- ", activecategoryArticle,"\n",
            //     'totalArticle:- ',totalArticle
            // );
            const response = await fetch(`/api/moreArticle?category=${activecategoryArticle}&totalArticle=${totalArticle}`);
            const responseJson = await response.json();
            console.log("responseJson:- ",responseJson);

            dispatch(addingNewArticle(responseJson.data));

            setCategoryArticles((prev)=>{
                const copyPrev = [...prev];
                const newArticle = [...prev,...responseJson.data]
                return newArticle
            });

        } catch (error) {
            console.log("Error in the moreArticle:- ", error);
        }
    }

    return (
        <div>
            {loading ?
                (<div>
                    <h1>Loading...</h1>
                </div>)
                :
                (<div className='p-2 m-auto max-w-[1280px]'>
                    <div className='max-w-[1280px] bg-purple-300'>
                        <Image src={"/images/defaultbanner.jpg"} alt='default banner' width={100} height={100} className='w-full h-[200px] object-cover rounded-md shadow-md' />
                    </div>
                    <div className='p-2'>
                        <AvatarComponents
                            fullname={intialProfile.fullname ?? "Guest"}
                            username={intialProfile.username ?? "Guest"}
                        />
                    </div>
                    {/* category scrollbar */}
                    <div className='bg-gray-900 text-white flex p-2 gap-2 overflow-x-auto rounded-md'>
                        {category?.map((data, index) => (
                            <div onClick={() =>{
                                categoryArticleShower(data),
                                setActiveCategory(data)
                            }} className='inline px-4 py-1.5 rounded-md shadow-md bg-red-400 cursor-pointer hover:bg-red-500 whitespace-nowrap' key={index}>{data}</div>
                        ))}
                    </div>
                    {/* category below part */}
                    <div className='grid grid-cols-2 max-[444px]:grid-cols-1'>
                        {categoryArticles.map((data, index) => (
                            <div className='relative' key={index}>
                                <BlogContainer {...data} key={index} className='' />
                                <div className='absolute bottom-2 right-4'>
                                    <span className='absolute right-12 cursor-pointer'>
                                        <Link href={`/edit/${data._id}`}>
                                        <FilePenLine className='hover:text-blue-500'/>
                                        </Link>
                                        </span>
                                    <span className='cursor-pointer' onClick={() => deleteArticle(data?._id)}><Trash2 className='hover:text-red-500'/></span>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* more article */}
                    <div className='text-center p-2 mt-4'>
                        <span onClick={() => moreArticle()} className='text-white bg-black p-2 rounded-md mt-4 cursor-pointer '>More Article</span>
                    </div>
                </div>)}
        </div>
    )
}

export default ProfilePage