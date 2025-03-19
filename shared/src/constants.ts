export const PASSWORD_MIN_LENGTH = 8
export const MAX_MESSAGE_LENGTH = 2000

export const errors = {
    unknownError: "Unknown Error",
    passwordTooShort: `Password should be atleast ${PASSWORD_MIN_LENGTH} characters long`,
    badPassword: "This password is not allowed",
    badEmail: "Incorrect email",
    passwordMismatch: "Passwords do not match",
    tooManyRequests: "Too many login attempts. Please try again later.",
    tooLongMessage: `Message cannot be longer than ${MAX_MESSAGE_LENGTH} characters`,
    messageNotEmpty: "Message shouldn't be empty",
    cantUpdateUsername: "You have already used all of your attempts",
    invalidPassword: "Invalid password",
    passwordRequired: "Password required",
    passwordNotAllowedWithOAuth: "Password not allowed with OAuth",
    invalidOAuthProof: "Invalid OAuth proof",
    registrationFailed: "Registration failed",
    userNotFound: "User not found",
    pleaseUseOAuthProvider: "Please, use OAuth provider",
    usernameNotEmpty: "Username shouldn't be empty",
    badUsername: "Incorrect username",
} as const

export const EmailRegex =
    /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const UsernameRegex = /^[a-zA-Z0-9_]{1,128}$/

export const PasswordRegex = /^[a-zA-Z0-9_!@#$%^&*()'"<>/?=+\-|\\[\]{}]{1,128}$/
