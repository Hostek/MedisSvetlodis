"use client"
import React from "react"

interface CircleAvatarProps {
    color: string
    letter: string
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ color, letter }) => {
    // Tailwind doesn't support dynamic gradient colors directly,
    // so we generate an inline style for gradient based on the passed color

    const gradientStyle = {
        background: `linear-gradient(135deg, ${color} 30%, ${lightenColor(color, 40)} 90%)`,
    }

    return (
        <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl select-none"
            style={gradientStyle}
        >
            {letter.toUpperCase()}
        </div>
    )
}

// Helper to lighten hex color by percentage
function lightenColor(hex: string, percent: number) {
    const hexWithoutHash = hex.replace("#", "")
    const num = parseInt(hexWithoutHash, 16)

    let r = (num >> 16) + Math.round(255 * (percent / 100))
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100))
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100))

    r = r > 255 ? 255 : r
    g = g > 255 ? 255 : g
    b = b > 255 ? 255 : b

    return `rgb(${r},${g},${b})`
}

export default CircleAvatar
