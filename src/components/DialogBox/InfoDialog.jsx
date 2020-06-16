import React from 'react';
import "./DialogBox.css";

const InfoDialog = ({restaurant, data, onClose}) => {


    return (
        <div className="loaderDialog">
            <div className='dialogBoxWrapp'>
                <div className='dialogInfoHeaderWrapp'>
                    <label className='dialogLbl'>{restaurant}</label>
                </div>
                <div>
                    <div>
                        <label>Name</label>
                    </div>
                    <div>
                        <label>Meal</label>
                    </div>
                    <div>
                        <label>Quantity</label>
                    </div>
                    <div>
                        <label>Price</label>
                    </div>
                    <div>
                        <label>Note</label>
                    </div>
                    <div>
                        <div>
                            {data.map(el => {
                                return (
                                <div key={el._id}>
                                    <div>
                                        <label>{el.user}</label>
                                    </div>
                                    <div>
                                        <label>{el.meal.name}</label>
                                    </div>
                                    <div>
                                        <label>{el.quantity}</label>
                                    </div>
                                    <div>
                                        <label>{el.meal.price * el.quantity}</label>
                                    </div>
                                    <div>
                                        <label>{el.note}</label>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='dialogInfoWrapp'>
                        <button className="dialogBtnNo" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default InfoDialog