import React, { useEffect, useRef, useState } from "react";
import EditInput from "./Input";
import { useForm, Controller } from "react-hook-form";
import Button from "./Button";
import { PropsContentEdit } from "../edit/[content]/page";
import AiButton from "./AiButton";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import {
    SYSTEM_PROMPTS,
    TITLE_SLUG_DESCRIPTION_PROMPTS,
} from "../../lib/constants";
import Groq from "groq-sdk";
import Image from "next/image";


interface DataPropsSubmission {
    blogImageUrl: string;
    category: string;
    content: string;
    createdby: string;
    featuredImagealt: string;
    slug: string;
    title: string;
    description: string;
    visibility: boolean;
}

const ContentEditor = ({ blogImageUrl, category, slug, content, title, description, featuredImagealt, _id }: PropsContentEdit) => {
    //   console.log(blogImageUrl,category,slug,content);

    const { control, handleSubmit, watch, setValue } = useForm<DataPropsSubmission>();
    // const textareaRef = useRef(null);
    const [newContent, setNewContent] = useState<string>(content ?? "");
    const [animation, setAnimation] = useState(false);
    const [slugAnimation, setslugAnimation] = useState(false);
    const [_, setItration] = useState(0);
    const [submission, setSubmission] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | undefined>(blogImageUrl);

    interface SlugPropsTitles{
        slug:string;
        title:string;
        description:string;
    }
    const [slugTitledes, setslugTitledes] = useState<SlugPropsTitles>({slug: slug ?? "",
        title: title ?? "",
        description: description ?? "",});

    const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true });

    const reset = () => {
        setNewContent(content ?? "");
    };

    const createdBy = {
        wwe: "Alice",
        cricket: "Bob",
        basketball: "Charlie",
        football: "David",
        others: "Eve",
    };
    const categoryValue = watch("category");
    useEffect(() => {
        if (categoryValue === "wwe") {
            setValue("createdby", createdBy.wwe);
        } else if (categoryValue === "cricket") {
            setValue("createdby", createdBy.cricket);
        } else if (categoryValue === "basketball") {
            setValue("createdby", createdBy.basketball);
        } else if (categoryValue === "football") {
            setValue("createdby", createdBy.football);
        } else {
            setValue("createdby", createdBy.others);
        }
    }, [categoryValue]);

    const imageUrl = watch("blogImageUrl");
    useEffect(() => {
        setImagePreview(imageUrl);
    }, [imageUrl]);

    const TitleDesSlugReWrite = async () => {
        try {
            console.log("Hello");

            // Qwen/QwQ-32B-Preview
            // microsoft/Phi-3-mini-4k-instruct
            const constentArticle = watch("content");
            setslugAnimation(true);


            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `${TITLE_SLUG_DESCRIPTION_PROMPTS}
          `
                    },
                    {
                        role: "user",
                        content: `${constentArticle}`,
                    },
                ],
                model: "llama-3.3-70b-versatile",
            });

            console.log(response);
            const content = response.choices[0].message.content;
            console.log(content);
            setslugAnimation(false);
            try {
                if (!content) {
                    return
                };

                const parseValue = JSON.parse(content);
                console.log(parseValue);
                if (parseValue.title && parseValue.description) {
                    setslugTitledes(parseValue);
                    setslugAnimation(false);
                } else {
                    console.log("no Json parse conver");
                    setslugAnimation(false);
                }
            } catch (error) {
                console.log("Error in Json convert", error);
                setslugAnimation(false);
            }
        } catch (error) {
            console.log("Error in tile and slug and description writing", error);
            setslugAnimation(false);
        }
    };

    useEffect(() => {
        setValue("slug", slugTitledes.slug);
        setValue("title", slugTitledes.title);
        setValue("description", slugTitledes.description);
    }, [slugTitledes]);

    // ai writer for content
    const aiWriter = async () => {
        // const data = textareaRef.current.innerHTML;
        console.log("yes ai started");
        

        const markdownValue = watch("content");
        console.log(markdownValue);

        try {
            setAnimation(true);

            const stream = await groq.chat.completions.create({
                messages: [
                    // Set an optional system message. This sets the behavior of the
                    // assistant and can be used to provide specific instructions for
                    // how it should behave throughout the conversation.
                    {
                        role: "system",
                        content: `${SYSTEM_PROMPTS}`,
                    },
                    // Set a user message for the assistant to respond to.
                    {
                        role: "user",
                        content:
                            `${markdownValue}`,
                    },
                ],

                // The language model which will generate the completion.
                model: "llama-3.3-70b-versatile",

                // The maximum number of tokens to generate. Requests can use up to
                // 2048 tokens shared between prompt and completion.
                max_tokens: 1024,

                // If set, partial message deltas will be sent.
                stream: true,
            })
            let iterationCount = 0;

            console.log(stream);
            

            for await (const chunk of stream) {
                if (chunk.choices && chunk.choices.length > 0) {
                    let newContent = chunk.choices[0].delta.content;
                    console.log(newContent);
                    
                    if (iterationCount > 0) {
                        // console.log(itration);
                        // if (newContent===undefined) {
                        //     setAnimation(false);
                        //     newContent = ""
                        // }
                        
                        setNewContent((prevState) => prevState + newContent);
                    } else {
                        // console.log(itration);
                        iterationCount += 1;
                        setNewContent(newContent ?? "");
                        setItration((prevState) => prevState + 1);
                    }
                }
            }

            setAnimation(false);
        } catch (error) {
            console.log("err in fetching aiwriter ", error);
            setAnimation(false);
        }
    };

    const submissionData = async (data:DataPropsSubmission) => {
        try {
            setSubmission(true);
            console.log(data);
            const ArticleRefinedData = {
                id:_id,
                blogImageUrl: data.blogImageUrl,
                category: data.category,
                content: data.content,
                createdby: data.createdby,
                featuredImagealt: data.featuredImagealt,
                slug: slug,
                title: data.title,
                description: data.description,
                visibility: data.visibility,
            };

            const response = await fetch("/edit/content/api", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ArticleRefinedData),
            });

            if (response.ok) {
                const responseJson = await response.json();
                console.log(responseJson);
            }
            setSubmission(false);
        } catch (error) {
            console.log("Error in Saving", error);
            setSubmission(false);
        }
    };

    return (
        <section>
            <div className="w-[80%] mx-auto flex gap-4 flex-col outline outline-1 rounded-md p-2 mt-2">
                <h1 className="font-bold text-2xl text-center ">Article </h1>

                <div>
                    <button onClick={TitleDesSlugReWrite}>
                        {slugAnimation ? "Generating" : "AI Generate"}
                    </button>
                </div>

                <form
                    className="flex gap-4 flex-col rounded-md p-2 mt-2"
                    onSubmit={handleSubmit(submissionData)}
                >
                    {/* slug */}
                    <Controller
                        name="slug"
                        disabled
                        control={control}
                        defaultValue={slug || ""}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <EditInput
                                {...field}
                                lableText="Slug"
                                inputname="slug"
                                placeholder="Enter Your Slug..."
                                className="lowercase"
                            />
                        )}
                    />
                    {/* title */}
                    <Controller
                        name="title"
                        control={control}
                        defaultValue={title || ""}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <EditInput
                                {...field}
                                lableText="Title"
                                inputname="title"
                                placeholder="Enter Your Title..."
                                className=""
                            />
                        )}
                    />
                    {/* description */}
                    <Controller
                        name="description"
                        control={control}
                        defaultValue={description ?? ""}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-4 items-center justify-center">
                                <label className="font-bold w-[20%]" htmlFor="description">Description</label>
                            <textarea {...field} className="outline-none focus:ring-1 shadow-inner px-7 py-3 rounded-md bg-slate-100 flex-1 min-h-28 resize-none">
                            </textarea>
                            </div>
                            
                        )}
                    />
                    {/* imageUrl */}
                    <Controller
                        name="blogImageUrl"
                        control={control}
                        defaultValue={blogImageUrl}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <EditInput
                                {...field}
                                lableText="Feature Image"
                                inputname="slblogImageUrlug"
                                placeholder="Enter Your Featured Image..."
                                className=""
                            />
                        )}
                    />
                    {/* image preview */}
                    <div className="w-[200px] h-[100px] mx-auto">
                        {imagePreview && <Image
                            src={imagePreview}
                            height={1000}
                            width={1000}
                            alt="Preview"
                            className="w-full h-full rounded-md shadow-md border border-red-100 object-cover"
                            style={{ aspectRatio: "16/9" }}
                            loading="lazy"
                            decoding="async"
                        />}
                    </div>
                    {/* alt featured Image */}
                    <Controller
                        name="featuredImagealt"
                        control={control}
                        defaultValue={featuredImagealt}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <EditInput
                                {...field}
                                lableText="Image Alt"
                                inputname="featuredImagealt"
                                placeholder="Enter Your Featured Image Alt..."
                                className=""
                            />
                        )}
                    />

                    {/* category */}
                    <Controller
                        name="category"
                        control={control}
                        defaultValue={category}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <EditInput
                                {...field}
                                lableText="Category"
                                inputname="category"
                                placeholder="Enter Your Category for article..."
                                className=""
                            />
                        )}
                    />

                    {/* editor */}
                    <Controller
                        name="createdby"
                        control={control}
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field }) => (
                            <EditInput
                                {...field}
                                lableText="Createdby"
                                inputname="createdby"
                                placeholder="Enter Your Createdby for article..."
                                className=""
                            />
                        )}
                    />

                    {/* public */}
                    <Controller
                        name="visibility"
                        control={control}
                        defaultValue={true}
                        render={({ field }) => (
                            <div className="flex items-center flex-wrap">
                                <label className="flex font-bold text-xl w-[15%] shrink-0">
                                    Visibility
                                </label>
                                <select
                                    {...field}
                                    className="shadow-md px-7 py-3 text-xl font-bold flex-1"
                                    value={String(field.value)}
                                >
                                    <option value="#">Choose Visibility</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                        )}
                    />

                    {/* content */}
                    <div className="flex justify-between items-center">
                        <span
                            className="bg-blue-400 w-fit px-3 py-1 rounded-md font-bold text-xl hover:cursor-pointer"
                            onClick={() => reset()}
                        >
                            Reset
                        </span>

                        <AiButton onClick={aiWriter} animation={animation} />
                    </div>

                    <Controller
                        name="content"
                        control={control}
                        defaultValue={content}
                        render={({ field }) => (
                            <MDEditor
                                data-color-mode="light"
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "10px",
                                    minHeight: "444px",
                                }}
                                {...field}
                                value={newContent}
                                onChange={(value) => {
                                    setNewContent(value || "");
                                    field.onChange(value);
                                }}
                            />
                        )}
                    />
                    <Button
                        submission={submission}
                        type="submit"
                        text={"Submit"}
                        className="bg-blue-400 px-7 py-3 rounded-md shadow-md mx-auto font-bold text-xl hover:bg-blue-600 "
                    />
                </form>
            </div>
        </section>
    );
};

export default ContentEditor;
