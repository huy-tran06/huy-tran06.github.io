function Person({p, setPersons}) {
    function updateName(){
        let newName = document.querySelector("#"+p.id).value; // Fixa korrekt senare..

        setPersons(prev=>{
            let u = prev.find(pu => pu.id == p.id);
            u.name = newName || u.name;

            return [...prev];
        })
    }

    return (                 
        <div>
            <h3>{p.name}</h3>
            <h5>{p.age}</h5>
            <input type="text" id = {p.id} placeholder="New Name"/>
            <br />
            <button onClick={updateName}>Update Name</button>
        </div>
    );
}

export default Person;