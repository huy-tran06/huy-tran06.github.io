import {useState, useContext} from "react";
import Car from "./Car";
import DataContext from "../context";

export default function Cars(){

    const {isLoggedIn} = useContext(DataContext);

    const [cars, setCars] = useState([
        {id:"id_1", brand:"Saab", model:"9-3"},
        {id:"id_2", brand:"Volvo", model:"Niva"},
        {id:"id_3", brand:"Volvo", model:"960"}
    ])

    function saveCar(ev){
        ev.preventDefault();
        const brand = ev.target.brand.value || "NO BRAND";
        const model = ev.target.model.value || "NO MODEL";
        console.log(brand, model);

        const id = "id_" + Date.now();
        setCars(prev => [{id, brand, model}, ...prev])
        console.log(cars)
    }

    return( 
        <div>
            <h3>CARS</h3>

            {isLoggedIn ? "Inloggad" : "Utloggad"}

            {isLoggedIn ? 
                <form action="" onSubmit={saveCar}>
                    <input type="text" name="brand" placeholder="Brand" />
                    <input type="text" name="model" placeholder="Model" />
                    <input type="submit" value="Save" />
                </form> : ""
            }

            

            {cars.map(c=><Car c={c} key = {c.id} setCars = {setCars}/>)}
        </div>
    );
}
