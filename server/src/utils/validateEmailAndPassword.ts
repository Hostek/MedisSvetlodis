import { EmailRegex, UsernameRegex, errors } from "../constants.js"

export function validateEmailAndPassword(password: string, email: string) {
    if (email.length > 250) {
        return { message: errors.emailTooLong }
    }

    if (!EmailRegex.test(email)) {
        return { message: errors.incorrectEmail }
    }

    if (password.length < 10) {
        return { message: errors.passwordTooShort }
    }

    if (password.length > 256) {
        return { message: errors.incorrectPassword }
    }

    return -1
}

export function validateEmailAndPasswordAndUsername(
    password: string,
    email: string,
    username: string
) {
    const validate = validateEmailAndPassword(password, email)

    if (validate !== -1) {
        return validate
    }

    if (username.length > 32) {
        return { message: errors.usernameTooLong }
    }

    if (username.length < 3) {
        return { message: errors.usernameTooShort }
    }

    if (username.includes("@")) {
        return { message: errors.incorrectUsername }
    }

    if (!UsernameRegex.test(username)) {
        return { message: errors.incorrectUsername }
    }

    return -1
}
