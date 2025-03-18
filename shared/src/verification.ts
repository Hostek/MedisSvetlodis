import {
    EmailRegex,
    errors,
    MAX_MESSAGE_LENGTH,
    PASSWORD_MIN_LENGTH,
    PasswordRegex,
} from "./constants"

export const getPasswordError = (value: string) => {
    if (value.length < PASSWORD_MIN_LENGTH) {
        return errors.passwordTooShort
    }
    if (!PasswordRegex.test(value)) {
        return errors.badPassword
    }

    return null
}

export const getEmailError = (value: string) => {
    if (!EmailRegex.test(value)) {
        return errors.badEmail
    }

    return null
}

export const getMessageError = (value: string) => {
    if (value.length < 1) {
        return errors.messageNotEmpty
    }

    if (value.length > MAX_MESSAGE_LENGTH) {
        return errors.tooLongMessage
    }

    return null
}
