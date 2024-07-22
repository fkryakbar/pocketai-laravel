import Gradient from "@/Components/Gradient";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button, Input } from "@nextui-org/react";
import { FormEventHandler } from "react";

export default function Index() {
    const { data, setData, errors, post, processing } = useForm({
        username: '',
        password: '',
    })
    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('loginAttempt'))
    }
    return <>
        <Head title="Login" />
        <Gradient />
        <main className="flex h-screen items-center justify-center">
            <div className="shadow-md bg-white p-8 rounded-lg lg:w-[400px] w-[90%]">
                <h1 className="text-blue-500 font-bold text-5xl text-center">Pocket AI</h1>
                <p className="text-gray-600 font-semibold text-center">Intelligence That Fits in Your Pocket.</p>
                <form onSubmit={submit} className="mt-5 flex flex-col gap-3" autoComplete="off">
                    <Input value={data.username} onChange={e => setData('username', e.target.value)} type="text" variant="bordered" label="Username" isInvalid={errors.username ? true : false} errorMessage={errors.username} isDisabled={processing} />
                    <Input value={data.password} onChange={e => setData('password', e.target.value)} type="password" variant="bordered" label="Password" isInvalid={errors.password ? true : false} errorMessage={errors.password} isDisabled={processing} />
                    <Button type="submit" color="primary" className="font-bold" isLoading={processing} isDisabled={processing}>LOGIN</Button>
                    <Link href="/about" className="text-blue-500 text-center hover:underline hover:text-blue-700">About PocketAI</Link>
                </form>
            </div>
        </main>
    </>
}