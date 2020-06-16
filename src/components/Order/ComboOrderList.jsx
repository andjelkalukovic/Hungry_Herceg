import React, { useState } from "react";
import './Order.css'

const ComboOrderList = ({
  meals,
  addOrderItems
}) => {
  const saltyMeals = meals.filter((meal) => meal.tag.toLowerCase().includes("slano"));
  const sweetMeals = meals.filter((meal) => meal.tag.toLowerCase().includes("slatko"));
  const [budget, setBudget] = useState(0);

  let comboRow = [];
  saltyMeals.forEach((saltyMeal) => {
    sweetMeals.forEach((sweetMeal) => {
      if (saltyMeal.price + sweetMeal.price <= budget) {
        comboRow.push(
          <div key={saltyMeal._id+sweetMeal._id} className='basicOrderTxt'>
            <div>{saltyMeal.name}</div>
            <div>{sweetMeal.name}</div>
            <div>{saltyMeal.price + sweetMeal.price}</div>
            <div>
              <img src='/img/add-order.png' alt='add' title='Add Combo' className='addOrderBtn'
                onClick={() => {
                  addComboItems(saltyMeal, sweetMeal);
                }}
              />
            </div>
          </div>
        );
      }
    });
  });

  const addComboItems = (saltyMeal, sweetMeal) => {
    addOrderItems([saltyMeal, sweetMeal]);
  };

    return(
        <div className='comboOrderWrapp'>
          <div className='comboHedingWrapp'>
          <h3>Get your perfect combo</h3>
          </div>
          <div className='comboOrderInptWrapp'>
            <input type="text" onChange={(e) => setBudget(e.target.value)} 
            placeholder='Enter your budget limit' className='basicOrderInput'/>  
            </div>     
            <div className='basicOrderTxt'>
                <div className='orderBold'>Meal</div>
                <div className='orderBold'>Dessert</div>
                <div className='orderBold'>Price</div>
                <div className='orderBold'>Actions</div>
            </div>
            <div className='comboRowWrapp' id="style-4">
                {comboRow}
                </div>
        </div>
    )
}

export default ComboOrderList;
