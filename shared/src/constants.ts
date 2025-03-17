export const errors = {
    unknownError: "Unknown Error",
}

export const EmailRegex =
    /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const UsernameRegex = /^[a-zA-Z0-9_]{1,128}$/

export const PasswordRegex = /^[a-zA-Z0-9_!@#$%^&*()'"<>/?=+\-|\\[\]{}]{1,128}$/
