import { fetchExchange } from "@urql/core"
import { cacheExchange, Resolver } from "@urql/exchange-graphcache"
import { stringifyVariables } from "urql"
import { LogoutMutation, UserDocument, UserQuery } from "../generated/graphql"
import { betterUpdateQuery } from "./betterUpdateQuery"
import { cachePusher } from "./cachePusher"
import { areObjectsEqual } from "./isEqual"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cursorPagination = (
    reqName: string = "getPublicZadania",
    fiName: string = "zadania",
    checkIfArgsAreEqual: boolean = true,
    __typename: string = "PaginatedZadania"
): Resolver => {
    return (_parent, fieldArgs, cache, info) => {
        const { parentKey: entityKey, fieldName } = info
        const allFields = cache.inspectFields(entityKey)
        // // console.log({ entityKey, fieldName, allFields })
        const fieldInfos = allFields.filter(
            (info) => info.fieldName === fieldName
        )
        // console.log({ fieldInfos })
        const size = fieldInfos.length
        if (size === 0) {
            return undefined
        }
        // // console.log({ size })

        let areArgsTheSame = true

        if (checkIfArgsAreEqual) {
            for (let i = 0; i < fieldInfos.length - 1; i++) {
                const fi_curr = fieldInfos[i].arguments
                const fi_next = fieldInfos[i + 1].arguments

                delete fi_curr?.cursor
                delete fi_next?.cursor

                if (!fi_curr && !fi_next) {
                    continue
                } else if (!fi_curr || !fi_next) {
                    areArgsTheSame = false
                    break
                }

                const areArgsEqual = areObjectsEqual(fi_curr, fi_next)

                if (!areArgsEqual) {
                    areArgsTheSame = false
                    break
                }
            }
        }

        const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
        // // console.log({ fieldKey, fieldArgs })
        const isItInTheCache = cache.resolve(
            cache.resolve(entityKey, fieldKey) as string,
            reqName
        )
        // // console.log({ isItInTheCache, "!isItInTheCache": !isItInTheCache })
        info.partial = !isItInTheCache
        // // console.log({ partial: info.partial })
        let hasMore = true
        const results: string[] = []
        // // console.log({ areArgsTheSame })
        if (areArgsTheSame) {
            fieldInfos.forEach((fi) => {
                cachePusher(
                    {
                        cache,
                        entityKey,
                        fieldKey: fi.fieldKey,
                        fiName,
                    },
                    (hs) => {
                        hasMore = hs
                    },
                    (data) => results.push(...data)
                )
            })
        } else {
            // let goodFieldInfos: FieldInfo[] = []

            const fi = fieldInfos.at(-1)

            if (fi) {
                const __unique_arg__ = fi.arguments?.unique_cache

                // // console.log({ __unique_arg__, fi })

                if (__unique_arg__ && fi.arguments) {
                    for (let i = 0; i < fieldInfos.length; i++) {
                        const inner_fi = fieldInfos[i]

                        if (!inner_fi.arguments) {
                            continue
                        }

                        const no_cursor_fi = { ...fi.arguments }
                        const no_cursor_inner_fi = { ...inner_fi.arguments }

                        delete no_cursor_fi["cursor"]
                        delete no_cursor_inner_fi["cursor"]

                        // // console.log({ no_cursor_fi, no_cursor_inner_fi })

                        if (areObjectsEqual(no_cursor_fi, no_cursor_inner_fi)) {
                            cachePusher(
                                {
                                    cache,
                                    entityKey,
                                    fieldKey: inner_fi.fieldKey,
                                    fiName,
                                },
                                (hs) => {
                                    hasMore = hs
                                },
                                (data) => results.push(...data)
                            )
                        }
                    }
                }

                if (!__unique_arg__) {
                    cachePusher(
                        {
                            cache,
                            entityKey,
                            fieldKey: fi.fieldKey,
                            fiName,
                        },
                        (hs) => {
                            hasMore = hs
                        },
                        (data) => results.push(...data)
                    )
                }
            }
        }

        // console.log({ results, hasMore, __typename })

        return {
            __typename,
            hasMore,
            [fiName]: results,
            id: Date.now(),
        }
    }
}

export const createUrqlClient = (ssrExchange: any) => ({
    // url: "http://localhost:3001/graphql",
    url: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    fetchOptions: {
        credentials: "include" as const,
    },
    exchanges: [
        cacheExchange({
            keys: {
                FieldError: () => null,
            },
            resolvers: {
                Query: {},
            },
            updates: {
                Mutation: {
                    //eslint-disable-next-line
                    logout: (_result, args, cache, info) => {
                        betterUpdateQuery<LogoutMutation, UserQuery>(
                            cache,
                            { query: UserDocument },
                            _result,
                            () => {
                                return { user: null }
                            }
                        )
                    },
                },
            },
        }),
        ssrExchange,
        fetchExchange,
    ],
})
