import { Cache } from "@urql/exchange-graphcache"
import {
    useBlockFriendRequestTokenMutation,
    useFriendRequestTokensOfUserQuery,
    useRegenerateFriendRequestTokenMutation,
    useUnblockFriendRequestTokenMutation,
} from "./generated/graphql"
import { DeepMerge, ExtractPromiseType } from "@hostek/shared"

export type betterUpdateQueryFn<R, Q> = (r: R, q: Q) => Q

export interface cachePusherArgs {
    cache: Cache
    entityKey: string
    fieldKey: string
    fiName: string
}

export type setHasMore = (hasMore: boolean) => any
export type pusher = (data: string[]) => any

export interface anyObj {
    [key: string]: any
}

export type FormErrors = Record<string, string | string[]>

export type HandleSubmit = React.FormEventHandler<HTMLFormElement>

export interface SvgWrapperOptions {
    onClick?: React.MouseEventHandler<SVGSVGElement>
}

export interface ReactIconProps {
    width?: string | number
    height?: string | number
    fill?: string
    className?: string
    viewBox?: string
    xmlns?: string
}

export type FriendRequestTokensType = Exclude<
    ReturnType<typeof useFriendRequestTokensOfUserQuery>[0]["data"],
    undefined
>["friendRequestTokensOfUser"]

export type blockFriendRequestTokenMutationType = ReturnType<
    typeof useBlockFriendRequestTokenMutation
>[1]

export type unblockFriendRequestTokenMutationType = ReturnType<
    typeof useUnblockFriendRequestTokenMutation
>[1]

export type blockFriendRequestTokenReturnType = ExtractPromiseType<
    ReturnType<blockFriendRequestTokenMutationType>
>
export type unblockFriendRequestTokenReturnType = ExtractPromiseType<
    ReturnType<unblockFriendRequestTokenMutationType>
>
export type blockOrUnblockMutRT = DeepMerge<
    blockFriendRequestTokenReturnType,
    unblockFriendRequestTokenReturnType
>

export type regenerateFriendRequestTokenMutationType = ReturnType<
    typeof useRegenerateFriendRequestTokenMutation
>[1]
