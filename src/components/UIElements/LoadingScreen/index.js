import React from 'react'
import FadeLoader from "react-spinners/FadeLoader"
import "./style.css"

function LoadingScreen({loading}) {
    return (
        <div className={loading ? "loading" : ""}>
            <FadeLoader color="white" loading={loading ? true : false} />
        </div>
    )
}

export default LoadingScreen
