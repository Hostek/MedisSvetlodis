import {
    FRIEND_REQUEST_STATUS_OBJ_TYPE,
    FRIEND_REQUEST_TOKEN_STATUS_OBJ_TYPE,
} from "./types"
export const PASSWORD_MIN_LENGTH = 8
export const MAX_MESSAGE_LENGTH = 2000
export const MAXIMUM_TOKEN_REGENERATION_COUNT = 5

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
    tokensAlreadyGenerated: "Tokens are already generated",
    couldntBlockFriendRequestToken: "Couldn't block friend request token",
    couldntUnBlockFriendRequestToken: "Couldn't unblock friend request token",
    unknownStatus: "Unknown status",
    tokenNotFound: "Token not found",
    friendRequestAlreadySent: "Friend request is already sent",
    cantSendFriendRequestToYourself:
        "You can't send friend request to yourself",
    transactionConflict: "Transaction conflict, please try again.",
    tokenUsageExhausted:
        "Token usage limit exhausted. Token has reached the maximum allowed consumption.",
    limitCannotBeNegative: "Limit cannot be negative",
    friendRequestNotFound: "Friend request not found",
    friendshipAlreadyExists: "Friendship already exists",
    invalidInput: "Invalid input",
    invalidToken: "Invalid token",
    cannotBlockYourself: "Cannot block yourself",
    notBlocked: "Cannot unblock because it is not blocked.",
    youAreBlocked: "User has blocked you",
    invalidPublicId: "Invalid public id",
    cannotMessageYourself: "You cannot message yourself.",
} as const

export const errors_values = Object.values(errors)

export const EmailRegex =
    /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const UsernameRegex = /^[a-zA-Z0-9_]{1,128}$/

export const PasswordRegex = /^[a-zA-Z0-9_!@#$%^&*()'"<>/?=+\-|\\[\]{}]{1,128}$/

export const UUID_Regex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

export const FRIEND_REQUEST_TOKEN_STATUS = [
    "active",
    "deleted",
    "blocked",
] as const

export const FRIEND_REQUESTS_STATUS = [
    "pending",
    "accepted",
    "rejected",
] as const

export const FRIEND_REQUEST_STATUS_OBJ: FRIEND_REQUEST_STATUS_OBJ_TYPE = {
    accepted: "accepted",
    pending: "pending",
    rejected: "rejected",
} as const

export const FRIEND_REQUEST_TOKEN_STATUS_OBJ: FRIEND_REQUEST_TOKEN_STATUS_OBJ_TYPE =
    {
        active: "active",
        blocked: "blocked",
        deleted: "deleted",
    } as const

export enum FriendRequestEnum {
    ACCEPT = "accept",
    REJECT = "reject",
}

export const CircleAvatarColors = [
    "#8B2D2D", // Dark warm red (brick)
    "#994D1E", // Dark burnt orange
    "#7A5230", // Dark golden brown
    "#3B5B45", // Deep forest green
    "#2E4A7A", // Dark steel blue
    "#673B7A", // Dark purple
    "#A04A4A", // Medium dark coral red
    "#6A4A2E", // Dark amber
    "#7A6A2E", // Dark mustard yellow
    "#4A6A6A", // Slate teal
    "#C56B6B", // Lighter warm red (brick)
    "#C87A4B", // Lighter burnt orange
    "#B38A57", // Lighter golden brown
    "#699A71", // Lighter forest green
    "#557EB5", // Lighter steel blue
    "#925DB5", // Lighter purple
    "#D07878", // Lighter coral red
    "#A67857", // Lighter amber
    "#C6B14A", // Lighter mustard yellow
    "#699A9A", // Lighter slate teal
]
