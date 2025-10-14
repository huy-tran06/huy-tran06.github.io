import {useState, useContext} from "react";
import DataContext from "../context";

function Car({c, setCars}) {

    const {isLoggedIn} = useContext(DataContext);

    function delCar(){
        setCars(prev => prev.filter(p => p.id != c.id));
    }

    function updateCar(ev){
        ev.preventDefault();
        const newBrand = ev.target.brand.value;
        const newModel = ev.target.model.value;

        setCars(prev=>{
            let car = prev.find(updatedCars => updatedCars.id == c.id);
            car.brand = newBrand || car.brand;
            car.model = newModel || car.model;

            return [...prev];
        })
    }

    return(
        <div>
            <h3>{c.brand}</h3>
            <h5>{c.model}</h5>

            {isLoggedIn ? 
            <div>
                <button onClick={delCar}>DELETE</button>

                <form action="" onSubmit={updateCar}>
                    <input type="text" name="brand" placeholder="New Brand"/>
                    <input type="text" name="model" placeholder="New Model"/>
                    <input type="submit" value="UPDATE"/>
                </form>
            </div> : ""
            }
            
        </div>
    );
}

export default Car;