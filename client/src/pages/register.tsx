// pages/register.tsx
import { useRegisterMutation } from "@/generated/graphql"
import { FormErrors } from "@/types"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NormalizeError } from "@/utils/normalizeError"
import { Button, Card, Form, Input } from "@heroui/react"
import { errors, getEmailError, getPasswordError } from "@hostek/shared"
import { signIn } from "next-auth/react"
import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEventHandler, useCallback, useMemo, useState } from "react"
import { GitHub } from "react-feather"

function Page() {
    const [password, setPassword] = useState("")
    const [passwordVerify, setPasswordVerify] = useState("")
    const [email, setEmail] = useState("")
    const [registerError, setRegisterError] = useState<string | null>(null)
    const [form_errors, setFormErrors] = useState<FormErrors>({})

    const Router = useRouter()

    const error = useMemo<string | null>(() => {
        if (registerError) return registerError
        if (typeof Router.query.error === "string") return Router.query.error
        return null
    }, [Router, registerError])

    const [{ fetching }, register] = useRegisterMutation()

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault()
            setRegisterError(null)
            setFormErrors({})

            const newErrors: FormErrors = {}
            const passwordError = getPasswordError(password)

            if (passwordError) {
                newErrors.password = passwordError
            }

            const emailError = getEmailError(email)
            if (emailError) {
                newErrors.email = emailError
            }

            if (password !== passwordVerify) {
                newErrors.password = errors.passwordMismatch
            }

            const newErrorsKeys = Object.keys(newErrors)
            if (newErrorsKeys.length > 0) {
                setFormErrors(newErrors)
                setRegisterError(NormalizeError(newErrors[newErrorsKeys[0]]))

                return
            }

            // Probably useless ...
            if (password !== passwordVerify) {
                return setRegisterError(errors.passwordMismatch)
            }

            const res = await register({ email, password })

            if (!res.data) {
                return setRegisterError(errors.unknownError)
            }

            if (res.data.register.errors) {
                return setRegisterError(res.data.register.errors[0].message)
            }

            if (res.data.register.user) {
                Router.push("/")
            }
        },
        [register, setRegisterError, email, password, Router, passwordVerify]
    )

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Create an Account
                    </h1>
                    <p className="mt-2 text-gray-600">Sign up to get started</p>
                </div>

                <Form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    validationErrors={form_errors}
                >
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
                            value={email}
                            onValueChange={setEmail}
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
                            value={password}
                            onValueChange={setPassword}
                        />
                    </div>

                    <div className="w-full">
                        <Input
                            id="verify-password"
                            type="password"
                            placeholder="••••••••"
                            className="mt-1"
                            isRequired
                            label="Repeat Password"
                            labelPlacement="outside"
                            fullWidth
                            value={passwordVerify}
                            onValueChange={setPasswordVerify}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        color="primary"
                        disabled={fetching}
                    >
                        Sign Up
                    </Button>

                    {error && (
                        <div className="w-full text-red-500">
                            Error: {error}
                        </div>
                    )}
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

                <Button
                    className="w-full"
                    variant="bordered"
                    onPress={() => {
                        signIn("github")
                    }}
                >
                    <GitHub />
                    Sign up with GitHub
                </Button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-primary-600 hover:text-primary-500"
                    >
                        Sign in
                    </Link>
                </p>
            </Card>
        </div>
    )
}

export default withUrqlClient(createUrqlClient)(Page)
