export const production = process.env.NODE_ENV === "production"
export const isInProduction = production

export const ONE_YEAR = 1000 * 60 * 60 * 24 * 365
export const TEN_YEARS = ONE_YEAR * 10

export const COOKIE_NAME = "qid"

export const EmailRegex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

export const UsernameRegex =
    /^(?=.{3,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/

export const errors = {
    emailTaken: "Email Taken",
    usernameTaken: "Username Taken",
    unknownError: "Unknown Error",
    incorrectEmail: "Incorrect Email",
    emailDoesNotExist: "Email Does Not Exist",
    incorrectPassword: "Incorrect Password",
    emailTooLong: "Email Too Long",
    passwordTooShort: "Password Too Short",
    usernameTooLong: "Username Too Long",
    usernameTooShort: "Username Too Short",
    incorrectUsername: "Incorrect Username",
}
