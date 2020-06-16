import "./DialogBox.css"
import React from 'react'


export default function DialogBox({onYes, onNo, title, message}){


    return(
        <div className="loaderDialog">
            <div className='dialogBoxWrapp'>
            <div className='dialogInfoHeaderWrapp'>
            <label className='dialogLbl'>{title}</label>
            </div>
            <div className='dialogInfoWrapp'>
            <label className='dialogMsgLbl'>{message}</label>
            </div>
            <div className='dialogBtnsWrapp'>
            <div className='dialogInfoWrapp'>
            <button className="dialogBtnYes" onClick={onYes}>Yes</button>
            </div>
            <div className='dialogInfoWrapp'><button className="dialogBtnNo" onClick={onNo}>No</button></div>
            </div>
            </div>
        </div>
    )
}
