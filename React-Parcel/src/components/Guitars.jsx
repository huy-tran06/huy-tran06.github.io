import { useEffect, useState } from "react";
import Guitar from "./Guitar";

export default function Guitars() {
    
const [guitars, setGuitars] = useState([]);


    async function getGuitars(){
        const response = await fetch("guitars.json");
 
        const data = await response.json();
    
        setGuitars(data);
       

        
    }
    
    useEffect(()=>{
        getGuitars()
    }, [])



    return(
        <div>
            <h3>GUITARS</h3>

            {guitars.map(g=> <Guitar g={g} key = {g.id} setGuitars = {setGuitars}/>)}
        </div>


        )
}



                //return <Guitar g={g} key = {g.id} setGuitars = {setGuitars}/>
