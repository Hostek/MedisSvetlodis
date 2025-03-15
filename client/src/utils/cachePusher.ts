import { cachePusherArgs, pusher, setHasMore } from "../types"

export function cachePusher(
    { cache, entityKey, fieldKey, fiName }: cachePusherArgs,
    setHasMore: setHasMore,
    pusher: pusher
) {
    const key = cache.resolve(entityKey, fieldKey) as string
    const data = cache.resolve(key, fiName) as string[]
    // console.log({ fiName })
    // console.log({ key, data })
    const _hasMore = cache.resolve(key, "hasMore")
    if (!_hasMore) {
        setHasMore(_hasMore as boolean)
    }
    // console.log({ przed: results })
    if (data) {
        // console.log({ data })
        pusher(data)
    }
    // console.log({ po: results })
}
