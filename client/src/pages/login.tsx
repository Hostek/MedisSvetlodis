// pages/login.tsx
import ContinueWith from "@/components/login/ContinueWith"
import OAuthButtons from "@/components/OAuthButtons"
import { useLoginMutation } from "@/generated/graphql"
import { useIsNotAuth } from "@/hooks/useIsNotAuth"
import { FormErrors } from "@/types"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { NormalizeError } from "@/utils/normalizeError"
import { Button, Card, Form, Input } from "@heroui/react"
import { errors, getEmailError, getPasswordError } from "@hostek/shared"
import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEventHandler, useCallback, useMemo, useState } from "react"

function Page() {
    useIsNotAuth()

    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    // const [errors, setErrors] = useState({})
    const [form_errors, setFormErrors] = useState<FormErrors>({})

    const Router = useRouter()

    const [loginError, setLoginError] = useState<string | null>(null)

    const error = useMemo<string | null>(() => {
        if (loginError) return loginError
        if (typeof Router.query.error === "string") return Router.query.error
        return null
    }, [Router, loginError])

    const [{ fetching }, login] = useLoginMutation()

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        async (e) => {
            e.preventDefault()

            setLoginError(null)
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

            const newErrorsKeys = Object.keys(newErrors)
            if (newErrorsKeys.length > 0) {
                setFormErrors(newErrors)
                setLoginError(NormalizeError(newErrors[newErrorsKeys[0]]))

                return
            }

            const res = await login({ email, password })

            if (!res.data) {
                return setLoginError(errors.unknownError)
            }

            if (res.data.login.errors) {
                return setLoginError(res.data.login.errors[0].message)
            }

            if (res.data.login.user) {
                setFormErrors({})
                Router.push("/")
            }
        },
        [login, setLoginError, email, password, Router]
    )

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
                            errorMessage={getPasswordError(password)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        color="primary"
                        disabled={fetching}
                    >
                        Sign In
                    </Button>

                    {error && (
                        <div className="w-full text-red-500">
                            Error: {error}
                        </div>
                    )}
                </Form>

                <ContinueWith />

                <OAuthButtons />

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
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
