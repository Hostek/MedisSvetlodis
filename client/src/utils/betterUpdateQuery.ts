import { QueryInput, Cache, Data, Variables } from "@urql/exchange-graphcache"
import { betterUpdateQueryFn } from "../types"

export function betterUpdateQuery<Result, Query, V = Variables, T = Data>(
    cache: Cache,
    qi: QueryInput<T, V>,
    result: any,
    fn: betterUpdateQueryFn<Result, Query>
) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any)
}
