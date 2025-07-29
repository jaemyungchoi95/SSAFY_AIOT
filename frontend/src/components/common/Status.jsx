import React from 'react'
import './Status.css'

const Status = ({text, type}) => {
  return (
    <div className={`Status Status_${type}`} >
        {text}
    </div>
  )
}

export default Status