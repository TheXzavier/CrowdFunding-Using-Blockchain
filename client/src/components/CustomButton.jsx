import React from 'react'
//Campaign Details and Create Campaign

const CustomButton = ({btnType,title,handleClick,styles}) => {
  return (
    <button
        type={btnType}
        className={`font-epilogue font-semibold text-[14px] leading-[26px] 
        text-white min-h-[30px] px-4 rounded-[10px] ${styles}`}
        onClick={handleClick}
    >

        {title}
    </button>
  )
}

export default CustomButton