// pages/login.tsx
import { createUrqlClient } from "@/utils/createUrqlClient"
import { Button, Card, Input, Form } from "@heroui/react"
import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { GitHub } from "react-feather"

function Page() {
    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                <Form className="space-y-4">
                    <div className="w-full">
                        <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            className="mt-1"
                            isRequired
                            label="Email"
                            labelPlacement="outside"
                            fullWidth
                        />
                    </div>

                    <div className="w-full">
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1"
                            isRequired
                            label="Password"
                            labelPlacement="outside"
                            fullWidth
                        />
                    </div>

                    <Button type="submit" className="w-full" color="primary">
                        Sign In
                    </Button>
                </Form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-950 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button className="w-full" variant="bordered">
                    <GitHub />
                    Login with GitHub
                </Button>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="#"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        Sign up
                    </Link>
                </p>
            </Card>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
