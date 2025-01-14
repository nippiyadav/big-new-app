'use client'

import Button from '@/app/components/Button';
import Input from '@/app/components/Input';
// import { AuthLogOut } from '@/lib/readux/authFetching';
import { AppDispatch } from '@/lib/readux/store';
import Link from 'next/link';
import { useParams,useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from 'react-redux';

interface FormProps {
  username: string,
  fullname: string,
  email: string,
  password: string
}

function Authentication() {
  const { authentication } = useParams();
  // const dispatch = useDispatch<AppDispatch>()
  const router = useRouter();
  console.log(authentication);
  const [error,setError] = useState("");
  const [submitData,setsubmitData] = useState(false);

  const { control, handleSubmit } = useForm<FormProps>();

  const formSubmission = async (data: FormProps) => {
    try {
      if (authentication === "signup") {
        console.log(data);
        const formdata = {
          username: data.username,
          fullname: data.fullname,
          email: data.email,
          password: data.password,
        }
        const response = await fetch('/auth/login/api?new=newAccount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formdata)
        });

        if (response.ok) {
          const responseJson = await response.json();
          console.log("JsonConverted",responseJson);
          
          if (responseJson.status === 500) {
            if (responseJson.message.code===11000) {
              const message = responseJson.message;
              console.log(message.keyValue);
              setError(`User already Exists:- ${message.keyValue.username}`)
            }
          }
        }

      }else if(authentication === "login"){
        
       try {
        setsubmitData(true)
        const formdata = {
          email: data.email,
          password: data.password,
        };
        console.log(formdata);
        
        const response = await fetch('/auth/login/api', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formdata)
        });
        
        if (response.ok) {
          const responseJson = await response.json();
          console.log("frontend data", responseJson);
          setsubmitData(false)
          setError(responseJson.message)
          if (responseJson.status===200) {
            router.push("/")
          }
        }
      } catch (error) {
        console.log("Error in Fetching",error);
        setsubmitData(false)
       }
      }
    } catch (error) {
      console.log("error in signUp error", error);
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
    <div className='p-2'>{authentication==="login"?
      (<h1 className='font-extrabold text-2xl text-center'>Login Form</h1>)
        :
      (<h1 className='font-extrabold text-2xl text-center'>Registration Form </h1>)}</div>

      <form className='flex flex-col gap-4 max-w-[444px] mx-auto shadow-md p-2 rounded-md' onSubmit={handleSubmit(formSubmission)}>
        {authentication === "signup" ?
          (<>
            <Controller
              name='username'
              control={control}
              defaultValue=""
              render={({ field }) =>
                <Input {...field} name='username' className='' placeholder='Enter Your username..' type='text' lableText='Username' />
              }
            />
            <Controller
              name='fullname'
              control={control}
              defaultValue=""
              render={({ field }) =>
                <Input {...field} name='fullname' className='' placeholder='Enter Your fullname..' type='text' lableText='Fullname' />
              }
            />
            <Controller
              name='email'
              control={control}
              defaultValue=""
              render={({ field }) =>
                <Input {...field} name='email' type='email' className='' placeholder='Enter Your email..' lableText='Email' />
              }
            />
            <Controller
              name='password'
              control={control}
              defaultValue=""
              render={({ field }) =>
                <Input {...field} type='password' name='password' className='' placeholder='Enter Your password..' lableText='Password' />
              }
            />
          </>)
          :
          (<>

            <Controller
              name='email'
              control={control}
              defaultValue=""
              render={({ field }) =>
                <Input {...field} name='email' type='email' className='' placeholder='Enter Your email..' lableText='Email' />
              }
            />
            <Controller
              name='password'
              control={control}
              defaultValue=""
              render={({ field }) =>
                <Input {...field} type='password' name='password' className='' placeholder='Enter Your password..' lableText='Password' />
              }
            />

          </>)}
        <Button submission={submitData} text='Submit' className='bg-blue-400 hover:bg-blue-500 w-fit mx-auto rounded-md font-bold' />

        <div>
          {error && (<p className='font-bold text-center text-red-400'>{error}</p>)}
        </div>

        <div>
          {authentication === "login" ?
            (<p className='text-center'>If You have not Created account <Link className='font-bold hover:underline' href='/auth/signup'>Sign Up</Link></p>)
            :
            (<p className='text-center'>If You have Created account <Link className='font-bold hover:underline' href='/auth/login'>Login</Link></p>)}
        </div>
      </form>
    </div>
  )
}

export default Authentication