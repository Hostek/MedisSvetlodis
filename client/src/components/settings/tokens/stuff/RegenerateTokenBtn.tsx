"use client"
import { RED_COLOR } from "@/constants"
import {
    FriendRequestTokensType,
    regenerateFriendRequestTokenMutationType,
} from "@/types"
import { MySwal } from "@/utils/MySwal"
import { Button } from "@heroui/react"
import {
    checkIfArrayExistsNotEmpty,
    errors,
    MAXIMUM_TOKEN_REGENERATION_COUNT,
} from "@hostek/shared"
import React from "react"
import { RefreshCw } from "react-feather"

interface RegenerateTokenBtnProps {
    value: FriendRequestTokensType[number]
    allFetching: boolean
    regenerateFriendRequestToken: regenerateFriendRequestTokenMutationType
    titleOfRegenBtn: string
    setAllError: React.Dispatch<React.SetStateAction<string | null>>
    setTokens: React.Dispatch<React.SetStateAction<FriendRequestTokensType>>
    i: number
}

const RegenerateTokenBtn: React.FC<RegenerateTokenBtnProps> = ({
    allFetching,
    value,
    regenerateFriendRequestToken,
    titleOfRegenBtn,
    setAllError,
    setTokens,
    i,
}) => {
    return (
        <Button
            aria-label={titleOfRegenBtn}
            title={titleOfRegenBtn}
            disabled={allFetching}
            isIconOnly
            color="success"
            className="mx-1"
            onPress={async () => {
                const res_popup = await MySwal.fire({
                    title: "Are you sure?",
                    text: `Please, do not regenerate tokens too often (you can perform this operation only ${MAXIMUM_TOKEN_REGENERATION_COUNT} times per day). After regeneration old token won't work anymore.`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: RED_COLOR,
                    // cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                    theme: "dark",
                })

                if (!res_popup.isConfirmed) {
                    return
                }

                setAllError(null)

                const res = await regenerateFriendRequestToken({
                    tokenId: value.id,
                })

                if (!res.data || res.error) {
                    return setAllError(errors.unknownError)
                }

                if (
                    checkIfArrayExistsNotEmpty(
                        res.data.regenerateFriendRequestToken.errors
                    )
                ) {
                    return setAllError(
                        res.data.regenerateFriendRequestToken.errors[0].message
                    )
                }

                if (!res.data.regenerateFriendRequestToken.token) {
                    return setAllError(errors.unknownError)
                }

                setTokens((prev) =>
                    prev.map((token, index) =>
                        index === i
                            ? (res.data?.regenerateFriendRequestToken.token ??
                              token)
                            : token
                    )
                )

                MySwal.fire({
                    title: "Success",
                    text: "Successfully regenerated token!",
                    icon: "success",
                    theme: "dark",
                })
            }}
        >
            <RefreshCw />
        </Button>
    )
}

export default RegenerateTokenBtn
