"use client"
import Error from "@/components/helper/Error"
import { useFriendRequestTokensOfUserQuery } from "@/generated/graphql"
import {
    Alert,
    Button,
    CircularProgress,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from "@heroui/react"
import React, { useCallback, useEffect, useState } from "react"
import TokensTable from "./TokensTable"
import { FriendRequestTokensType } from "@/types"
import { QRCodeSVG } from "qrcode.react"
import { useWindowSize } from "@/hooks/useWindowSize"

interface ListOfTokensProps {}

const ListOfTokens: React.FC<ListOfTokensProps> = ({}) => {
    const [{ fetching, data }] = useFriendRequestTokensOfUserQuery()
    const [showFriendRequestTokens, setShowFriendRequestTokens] =
        useState(false)

    const { width } = useWindowSize()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleOpen = useCallback(() => {
        onOpen()
    }, [onOpen])

    const [allError, setAllError] = useState<string | null>(null)

    const [tokens, setTokens] = useState<FriendRequestTokensType>([])

    useEffect(() => {
        if (data?.friendRequestTokensOfUser) {
            setTokens(data.friendRequestTokensOfUser)
        }
    }, [data])

    if (fetching || !data || data.friendRequestTokensOfUser.length < 1) {
        return <CircularProgress aria-label="fetching" />
    }

    return (
        <>
            <Button
                className="w-full"
                disabled={fetching}
                onPress={() => {
                    setShowFriendRequestTokens((prev) => !prev)
                }}
            >
                Show Friend Request Tokens
            </Button>
            {showFriendRequestTokens && (
                <>
                    <Alert color="warning" className="my-2">
                        Show these only to people who you want to be friends
                        with!
                    </Alert>

                    {allError && <Error>Error: {allError}</Error>}

                    <TokensTable
                        setAllError={setAllError}
                        setTokens={setTokens}
                        tokens={tokens}
                    />

                    <Button
                        fullWidth
                        className="mt-2"
                        color="primary"
                        onPress={() => handleOpen()}
                    >
                        Show QR Codes
                    </Button>

                    <Modal isOpen={isOpen} size={"4xl"} onClose={onClose}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">
                                        QR Codes for tokens
                                    </ModalHeader>
                                    <ModalBody>
                                        <div className="flex justify-between bg-orange-700 p-5">
                                            {tokens.map((token) => {
                                                return (
                                                    <div
                                                        key={`${token.token}_${token.token}`}
                                                    >
                                                        <div
                                                            style={{
                                                                maxWidth: width
                                                                    ? Math.min(
                                                                          width /
                                                                              5,
                                                                          217.5
                                                                      )
                                                                    : 256,
                                                            }}
                                                            className="mb-2"
                                                        >
                                                            {token.token}
                                                        </div>
                                                        <QRCodeSVG
                                                            size={
                                                                width
                                                                    ? Math.min(
                                                                          width /
                                                                              5,
                                                                          217.5
                                                                      )
                                                                    : 256
                                                            }
                                                            value={`${process.env.NEXT_PUBLIC_BASE_URL}/friend-request?defaulttoken=${encodeURIComponent(token.token)}`}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onPress={onClose}
                                        >
                                            Close
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
        </>
    )
}

export default ListOfTokens
