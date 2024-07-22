import Gradient from "@/Components/Gradient";
import CostumMarkdown from "@/Components/Markdown";
import { Chat } from "@/types";
import { Head } from "@inertiajs/react";
import { Button, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function Index() {

    const [prompt, setPrompt] = useState('');
    const [chats, setChats] = useState<Chat[]>([]);
    const [inComingChat, setIncomingChat] = useState('');
    const endOfChatsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (endOfChatsRef.current) {
            endOfChatsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [inComingChat]);
    const send = async () => {

        setChats((prev) => {
            const newChat = {
                role: 'user',
                content: prompt
            }
            return [...prev, newChat]
        })
        setPrompt('')
        const response = await fetch(route('completion'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });
        if (!response.body) {
            throw new Error('ReadableStream not yet supported in this browser.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        setIncomingChat('')
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
            setIncomingChat(result)
        }
        setIncomingChat('')
        setChats((prev) => {
            const newChat = {
                role: 'system',
                content: result
            }
            return [...prev, newChat]
        })

    }

    return <>
        <Head title="Chat" />
        <Gradient />

        <main className="lg:w-[50%] w-[95%]  mx-auto mt-5 bg-white p-5 rounded-lg shadow-md">
            <h1 className="text-blue-500 font-bold text-3xl">Pocket AI</h1>
            <p>An artificial intelligence assistant inside a pocket</p>
            <div className="w-full rounded border-[1px] max-h-[400px] min-h-[200px] overflow-y-auto mt-5 p-5 flex flex-col gap-2 prose prose-sm max-w-none">
                {
                    chats.length > 0 ? chats.map((chat, key) => (
                        <div key={key}>
                            {
                                chat.role == 'user' ? (<>
                                    <div className={`flex justify-end`}>
                                        <div className="px-4 bg-gray-100 rounded-lg w-fit lg:max-w-[80%] max-w-[100%]">
                                            <CostumMarkdown>{chat.content}</CostumMarkdown>
                                        </div>
                                    </div>
                                </>) : (<>
                                    <div className={`flex justify-start`}>
                                        <div className="px-4 bg-gray-100 rounded-lg w-fit lg:max-w-[80%] max-w-[100%]">
                                            <CostumMarkdown>{chat.content}</CostumMarkdown>
                                        </div>
                                    </div>
                                </>)
                            }

                        </div>
                    )) : <EmptyChat />
                }
                {
                    inComingChat.length > 0 ? (<>
                        <div className={`flex justify-start`}>
                            <div className="px-4 bg-gray-100 rounded-lg w-fit lg:max-w-[80%] max-w-[100%]">
                                <CostumMarkdown>{inComingChat}</CostumMarkdown>
                            </div>
                        </div>
                    </>) : null
                }
                <div ref={endOfChatsRef} />
            </div>
            <div className="mt-3 flex gap-3">
                <Textarea
                    minRows={2}
                    variant="bordered"
                    placeholder="Tell me your problem"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                />
                <Button onClick={send} isDisabled={prompt.length == 0} className="inline-flex h-[58px] text-white" color="success"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
                </Button>
            </div>
        </main>


    </>
}

function EmptyChat() {
    return <>
        <div className="flex flex-col items-center text-gray-600 dark:text-slate-300 max-h-[400px] min-h-[200px] justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-20 h-20"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
            </svg>
            <p className="font-semibold">How can i help you today?</p>
        </div>
    </>
}