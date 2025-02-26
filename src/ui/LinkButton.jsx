import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
export default function LinkButton({children, to}) {
    const navigate = useNavigate();
    if (to == '-1') {
        return (
            <button onClick={() => navigate(-1)} className='text-sm text-blue-500 hover:text-blue-600 hover:underline'>&larr; Go back</button>
        )
    }
    else {
        return (
            <Link to= {to} className='text-sm text-blue-500 hover:text-blue-600 hover:underline'>{children}</Link>
          )

    }
  
}
