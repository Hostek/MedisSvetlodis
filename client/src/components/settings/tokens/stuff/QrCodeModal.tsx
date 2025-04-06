"use client"
import { useWindowSize } from "@/hooks/useWindowSize"
import { FriendRequestTokensType } from "@/types"
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react"
import { QRCodeSVG } from "qrcode.react"
import React, { useMemo } from "react"

interface QrCodeModalProps {
    isOpen: boolean
    onClose: () => void
    tokens: FriendRequestTokensType
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({
    isOpen,
    onClose,
    tokens,
}) => {
    const { width } = useWindowSize()

    const realWidth = useMemo(() => {
        return width ? Math.min(width / 5, 217.5) : 256
    }, [width])

    return (
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
                                                    maxWidth: realWidth,
                                                }}
                                                className="mb-2"
                                            >
                                                {token.token}
                                            </div>
                                            <QRCodeSVG
                                                size={realWidth}
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
    )
}

export default QrCodeModal
