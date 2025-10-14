import {useState} from "react";
import Person from "./Person";

function Persons() {

    const [persons, setPersons] = useState([
        {id: "id_1", name:"Lenny", age: 43},
        {id: "id_2", name:"Lena", age: 33},
        {id: "id_3", name:"Lennart", age: 53},
    ])

    return ( 
        <div>
            <h2>Names</h2>

            {persons.map(p=>(
                <Person key={p.id} p={p} setPersons = {setPersons}/>
            ))}
        </div>
     );
}

export default Persons;