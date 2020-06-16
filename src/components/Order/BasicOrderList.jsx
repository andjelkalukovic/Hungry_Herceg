import React from "react";
import './Order.css'

const BasicOrderList = ({filteredMeals,addOrderItems,filterMeals}) => {


    return (
        <div className='basicOrderList'>
            <div className='basicOrderInpWrapp'>
            <input type="text" onChange={(e) => filterMeals(e.target.value)}
                className='basicOrderInput' placeholder='Enter a meal name or a meal tag' />
                </div>
            <div className='basicOrderTxt'>
                    <div className='orderBold'>Meal</div>
                    <div className='orderBold'>Price</div>
                    <div className='orderBold'>Quantity</div>
                    <div className='orderBold'>Actions</div>
            </div>
        <div id="style-4" className='basicOrderTxtWrapp'>   {filteredMeals.map(meal => {
                return (
                    <div key={meal._id} className='basicOrderTxt'>
                        <div style={{cursor: "pointer"}}
                            onClick={() => {
                                let array = [meal];
                                addOrderItems(array);
                        }}>{meal.name}</div>
                        <div>{meal.price}</div>
                        <div className='bacisNumberDiv'><input defaultValue="1" min="1" id={'q' + meal._id} type="number" className='orderQuantity' /></div>
                        <div><img src='/img/add-order.png' alt='add' title='Add Order' className='addOrderBtn' onClick={() => {
                            let array = [meal];
                            addOrderItems(array);
                        }}/></div>
                    </div>
                )
            })}</div> 
        </div>
    )
}

export default BasicOrderList