"use client"
import React from "react"

interface ContinueWithProps {}

const ContinueWith: React.FC<ContinueWithProps> = ({}) => {
    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-950 text-gray-500">
                    Or continue with
                </span>
            </div>
        </div>
    )
}

export default ContinueWith
