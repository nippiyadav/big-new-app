
import { SendIcon, ThumbsDown, ThumbsUp } from 'lucide-react'
import React, { useRef, useState } from 'react'

interface CommentsProps {
    text: string;
    createdBy: {
        username: string;
        fullname: string;
    };
    likes: number;
    dislikes: number;
}

function CommentComponents() {
    const [comments, setComments] = useState<CommentsProps[]>([]);

    const commentInputRef = useRef<HTMLInputElement>(null);

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
            const newObj: CommentsProps = {
                text: text,
                likes: 0,
                dislikes: 0,
                createdBy: {
                    fullname: "Chandan Yadav",
                    username: "chandanyadav"
                }
            }
            const newCommemt = [newObj, ...copyPrev];
            return newCommemt
        });

        commentInputRef.current.value = ""
    };

    return (
        <div className='p-4 bg-gray-700'>
            <h1 className='text-2xl font-bold text-center  text-white p-2'>Comments</h1>
            <div>
                <div className='h-[444px] shadow-inner overflow-y-auto comment_overflow'>
                    {comments.map((data, index) => (
                        <div className='p-2 bg-black text-white mb-2 rounded-md' key={index}>
                            <h1 className='font-bold text-xl mb-2'>{data.text}</h1>
                            <div className='flex gap-2 items-center'>
                                <span className='flex gap-2 items-center justify-center'>
                                    <ThumbsUp />
                                    <span className='font-bold text-blue-500'>{data.likes}</span>
                                </span>
                                <span className='flex gap-2 items-center justify-center'>
                                    <ThumbsDown />
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