import { SingleArticleProps } from '@/lib/readux/singleArticleFetched'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
// import markdownit from 'markdown-it'
import { marked } from 'marked';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/readux/store';
import Link from 'next/link';
import NotLoggedINError from '../notLoggedInError';
import { SendIcon } from 'lucide-react';
import CommentComponents from '../CommentComponents';


const ArticleShowerComp = ({ _id, blogImageUrl, featuredImagealt, content, isLiked, createdBy, likes, dislikes, isDisLiked }: SingleArticleProps) => {
  // const md = new markdownit();
  // const result = md.render(content)
  const result = marked(content);
  // console.log(title);
  const [increaseLikes, setIncreaseLikes] = useState(likes);
  const [stateIsLiked, setStateIsLiked] = useState(false);
  // dislikes
  const [increaseDisLikes, setIncreaseDisLikes] = useState(dislikes);
  const [stateIsDisLiked, setStateIsDisLiked] = useState(false);
  // following
  const [stateFollower, setStateFollower] = useState(false);

  // useRef
  const popupRef = useRef<HTMLDivElement>(null);

  const { data } = useSelector((state: RootState) => state.auth);

  console.log("userdata:- ", data);

  useEffect(() => {
    setStateIsLiked(isLiked);
    setIncreaseLikes(likes);

    setIncreaseDisLikes(dislikes);
    setStateIsDisLiked(isDisLiked);

    setStateFollower(createdBy.isFollowed);
  }, [isLiked, dislikes, createdBy.isFollowed]); // Runs whenever `isLiked` changes

  const [userClickedWithLoggedIn, setUserClickedWithLoggedIn] = useState<Record<string, string | boolean>>({ clickBtn: "", notLogeedIn: false });

  const likesFun = async () => {
    if (data?._id) {

      if (stateIsLiked) {
        setStateIsLiked(false);
        setIncreaseLikes(increaseLikes - 1);
        const response = await fetch(`/api?id=likes&articleId=${_id}`);
        if (response.ok) {
          const responseJson = await response.json();
          console.log(responseJson);
        }
      } else {
        setIncreaseLikes(increaseLikes + 1);
        setStateIsLiked(true);
        const response = await fetch(`/api?id=likes&articleId=${_id}`);
        if (response.ok) {
          const responseJson = await response.json();
          console.log(responseJson);
        }
      }

    } else {
      setUserClickedWithLoggedIn({ clickBtn: "like", notLogeedIn: true })
    }
  }

  const dislikesFun = async () => {
    if (data?._id) {

      if (stateIsDisLiked) {
        setStateIsDisLiked(false);
        setIncreaseDisLikes(increaseDisLikes - 1);
        console.log("You reverse disliked");
        const response = await fetch(`/api?id=dislikes&articleId=${_id}`);

        if (response.ok) {
          const responseJson = await response.json();
          console.log(responseJson);
        }

      } else {
        setStateIsDisLiked(true);
        setIncreaseDisLikes(increaseDisLikes + 1);
        console.log("You did disliked");
        const response = await fetch(`/api?id=dislikes&articleId=${_id}`);

        if (response.ok) {
          const responseJson = await response.json();
          console.log(responseJson);
        }
      }

    } else {
      setUserClickedWithLoggedIn({ clickBtn: "dislike", notLogeedIn: true })
    }
  }

  const followFun = async () => {
    if (data?._id) {

      if (stateFollower) {
        setStateFollower(false);
        console.log("You unfollowed");

        const response = await fetch(`/api?id=follow&creatorId=${createdBy._id}`);

        if (response.ok) {
          const responseJson = await response.json();
          console.log(responseJson);
        }
      } else {
        setStateFollower(true);
        console.log("You followed");

        const response = await fetch(`/api?id=follow&creatorId=${createdBy._id}`);

        if (response.ok) {
          const responseJson = await response.json();
          console.log(responseJson);
        }
      }

    } else {
      setUserClickedWithLoggedIn({ clickBtn: "follow", notLogeedIn: true })
    }
  }

  // This function handles clicks on the document.
  // It checks if the click was outside the popup.
  const handleClickOutside = (event: MouseEvent) => {
    // If popupRef.current exists and the clicked element is NOT inside the popup:
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setUserClickedWithLoggedIn({ clickBtn: "", notLogeedIn: true });
    }
  };

  useEffect(()=>{
    // Only add the event listener if the popup is shown
    if (userClickedWithLoggedIn.notLogeedIn) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    // Clean up the event listener when the component unmounts or showPopup changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  },[userClickedWithLoggedIn.notLogeedIn])

  return (
    <section className='max-w-screen-lg mx-auto'>
      {/* image shower */}
      <div className='max-w-screen-lg px-3 mx-auto'>
        <figure className='relative'>
          <Image alt={featuredImagealt} priority src={blogImageUrl} width={100} height={100} className='w-full h-auto rounded-md shadow-sm object-cover overflow-hidden' style={{ aspectRatio: "16/9" }} unoptimized />
          <figcaption className='bg-black/25 absolute bottom-0 text-cyan-50 font-bold block w-full rounded-b-md'>
            <p className='p-2'>{featuredImagealt}</p></figcaption>
        </figure>
      </div>

      {/* banner of follow name */}
      <div className='px-4 py-2 flex justify-between flex-wrap '>
        <Link href={`/${createdBy.username}`}>
        <div className='p-2 flex gap-2'>
          <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s"} alt='avatar logo' width={100} height={100} className='w-12 h-12 object-cover rounded-full ' />
          <div className='flex flex-col font-bold'>
            <span>{createdBy.fullname}</span>
            <span className='text-gray-400'>@{createdBy.username}</span>
          </div>
        </div>
        </Link>

        <div className='flex flex-1 gap-2 justify-center min-[444px]:justify-end items-center'>
          <div>
            <button onClick={() => followFun()} className='px-7 py-3 bg-pink-400 font-bold rounded-md shadow-sm relative'>{stateFollower ? "Following" : "Follow"}
              {/* not logged in components */}
              {userClickedWithLoggedIn.clickBtn === "follow" && userClickedWithLoggedIn.notLogeedIn === true ?
                <NotLoggedINError popupRef={popupRef} btnText={"Follow"} />
                : <></>}
            </button>
          </div>
        </div>
      </div>

      {/* like and dislikes */}
      <div className='flex px-4 py-2'>
        <div className='flex gap-4'>

          <button disabled={stateIsDisLiked ? true : false} onClick={() => likesFun()} className={`like-dislike-button ${stateIsLiked ? "bg-red-700" : "bg-red-100 relative"}`}>{`Likes ${increaseLikes}`}
            {/* not logged in components */}
            {userClickedWithLoggedIn.clickBtn === "like" && userClickedWithLoggedIn.notLogeedIn === true ?
              <NotLoggedINError popupRef={popupRef}  btnText={"Like"} />
              : <></>}
          </button>

          <button disabled={stateIsLiked ? true : false} onClick={() => dislikesFun()} className={` like-dislike-button ${stateIsDisLiked ? "bg-red-700" : "bg-red-100 relative"}`}>{`Dislikes ${increaseDisLikes}`}
            {/* not logged in components */}
            {userClickedWithLoggedIn.clickBtn === "dislike" && userClickedWithLoggedIn.notLogeedIn === true ?
              <NotLoggedINError popupRef={popupRef}  btnText={"Dislike"} />
              : <></>}
          </button>

        </div>
      </div>

      {/* content shower */}
      <article>
        <div
          className="markdown-content max-w-screen-lg mx-auto px-4"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </article>
      {/* commenting features */}
      <CommentComponents/>
    </section>
  )
}

export default ArticleShowerComp