import { errors, PASSWORD_MIN_LENGTH, PasswordRegex } from "./constants"

export const getPasswordError = (value: string) => {
    if (value.length < PASSWORD_MIN_LENGTH) {
        return errors.passwordTooShort
    }
    if (!PasswordRegex.test(value)) {
        return errors.badPassword
    }

    return null
}
