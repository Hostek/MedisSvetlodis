import {
    FRIEND_REQUEST_TOKEN_STATUS,
    FRIEND_REQUESTS_STATUS,
} from "./constants"

export type FRIEND_REQUEST_TOKEN_STATUS_TYPE =
    (typeof FRIEND_REQUEST_TOKEN_STATUS)[number]

export type FRIEND_REQUESTS_STATUS_TYPE =
    (typeof FRIEND_REQUESTS_STATUS)[number]

export type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never

export type DeepMerge<T, U> = {
    [K in keyof T | keyof U]?: K extends keyof T & keyof U
        ? T[K] extends object
            ? U[K] extends object
                ? DeepMerge<T[K], U[K]> // Recursively merge objects
                : T[K] & U[K] // If types differ, use intersection (&)
            : T[K] & U[K] // If not objects, use intersection (&)
        : K extends keyof T
          ? T[K]
          : K extends keyof U
            ? U[K]
            : never
}

export type FRIEND_REQUEST_STATUS_OBJ_TYPE = {
    [K in FRIEND_REQUESTS_STATUS_TYPE]: K
}
