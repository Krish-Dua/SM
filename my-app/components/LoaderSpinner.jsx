import {  Loader2 } from 'lucide-react'
import React from 'react'

const LoaderSpinner = ({size=20,animationDuration="1s"}) => {
  return (
    <Loader2 style={{animationDuration:animationDuration}} className='animate-spin' size={size}/>
  )
}

export default LoaderSpinner
