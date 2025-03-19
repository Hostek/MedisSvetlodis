import { Cache } from "@urql/exchange-graphcache"

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
