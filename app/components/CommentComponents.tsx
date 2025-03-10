
import { SendIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

// interface CommentsProps {
//     text: string;
//     createdBy: {
//         username: string;
//         fullname: string;
//     };
//     likes: number;
//     dislikes: number;
// }

interface CommentComponentsProps {
    articleId: string
}

interface intialCommentProps {
    _id?: string;
    blog?: string
    createdAt?: string
    dislikes: string[]
    likes: string[]
    text: string
    updatedAt?: string
    user: {
        fullname: string
        username: string
        _id?: string
    }
}

function CommentComponents({ articleId }: CommentComponentsProps) {
    const [comments, setComments] = useState<intialCommentProps[]>([]);
    const [intialCommentSend,setIntialCommentSend] = useState<number>(0);

    const commentInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (intialCommentSend === 0) {
            const intialComment = async () => {
                try {
                    const response = await fetch(`/api/comment/fetchingComment?blogId=${articleId}&fetchedComment=${comments.length}`);
                    const responseJson = await response.json();
                    console.log("responsJson:- ", responseJson);
    
                    if (responseJson.comment) {
                        const previousComment:intialCommentProps = responseJson.comment;
                        setComments((prev) => {
                            return [...prev,previousComment]
                        })
                    }
                    setIntialCommentSend(prev=> prev+1)
                } catch (error) {
                    console.log("Error in the time intialComment Fetching:- ", error);
                }
            }
            intialComment()
        }
    }, [articleId]);



    const commentingButton = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("commenting running");

        e.preventDefault();
        const text = commentInputRef.current?.value;
        console.log("text", text);


        if (!text) {
            return
        };

        setComments((prev) => {
            const copyPrev = prev;
            const newObj: intialCommentProps = {
                text: text,
                likes: [],
                dislikes: [],
                user: {
                    _id:"676b6d28a779ddfa615874ab",
                    fullname: "Chandan Yadav",
                    username: "chandanyadav"
                }
            }
            const newCommemt = [newObj, ...copyPrev];
            return newCommemt
        });

        const newComment = {
            articleId: articleId,
            text: text
        }

        try {
            const response = await fetch("/api/comment/newComment", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(newComment)
            });
            const responseJson = await response.json();
            console.log("responseJson:- ", responseJson);

        } catch (error) {
            console.log("Error in CommentingButton:- ", error);
        }

        commentInputRef.current.value = ""
    };

    const commentLikeButton = async (id: string) => {
        console.log("Comment:- ", id);
        setComments((prev) => {
            const newData = prev.map((data, index) => {
                if (data._id === id) {
                    return { ...data, likes: [...data.dislikes,id] }
                } else {
                    return data
                }
            })
            return newData
        });

    }

    const commentDisLikeButton = async (id: string) => {
        setComments((prev) => {
            return prev.map((data, index) => {
                if (data._id === id) {
                    return { ...data, dislikes: [...data.dislikes,id] }
                } else {
                    return data
                }
            })
        })
    }

    return (
        <div className='p-4 bg-gray-700'>
            <h1 className='text-2xl font-bold text-center  text-white p-2'>Comments</h1>
            <div>
                <div className='h-[444px] shadow-inner overflow-y-auto comment_overflow'>
                    {comments.map((data, index) => (
                        <div className='p-2 bg-black text-white mb-2 rounded-md' key={index}>
                            <div className='flex gap-2 items-center'>
                                <Link href={`/${data.user.username}`}>
                                <span>
                                    <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s"} width={100} height={100} alt='avatar image' className='w-8 h-8 rounded-full object-cover' />
                                </span>
                                <span>@{data.user.username}</span>
                                </Link>
                            </div>
                            <h1 className='font-bold text-xl mb-2'>{data.text}</h1>
                            <div className='flex gap-2 items-center'>
                                <span className='flex gap-2 items-center justify-center'>
                                    <ThumbsUp onClick={() => commentLikeButton(data._id as string)} className='hover:text-blue-600 cursor-pointer' />
                                    <span className='font-bold text-blue-500'>{data.likes}</span>
                                </span>
                                <span className='flex gap-2 items-center justify-center'>
                                    <ThumbsDown onClick={() => commentDisLikeButton(data._id as string)} className='hover:text-red-600 cursor-pointer' />
                                    <span className='font-bold text-red-500 mb-2'>{data.dislikes}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                {/* commenting input */}
                <form onSubmit={(e) => commentingButton(e)} className='flex gap-2 mt-2'>
                    <input ref={commentInputRef} type="text" className='w-full shadow-md px-4 py-4 rounded-md outline-none' placeholder='message...' />
                    <button type='submit'>
                        <SendIcon color='white' />
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CommentComponents