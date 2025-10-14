export default function Guitar({g, setGuitars}) {

    function delGui(){
        setGuitars(prev => prev.filter(p => p.id != c.id));
    }

    function updateGuitar(ev){
        ev.preventDefault();
        const newBrand = ev.target.brand.value;
        const newModel = ev.target.model.value;

        setGuitars(prev=>{
            let guitar = prev.find(updatedGuitars => updatedGuitars.id == c.id);
            guitar.brand = newBrand || guitar.brand;
            guitar.model = newModel || guitar.model;

            return [...prev];
        })
    }

    return(
        <div>
            <h3>{g.brand}</h3>
            <h5>{g.model}</h5>
            <button onClick={delGui}>DELETE</button>

            <form action="" onSubmit={updateGuitar}>
                <input type="text" name="brand" placeholder="New Brand"/>
                <input type="text" name="model" placeholder="New Model"/>
                <input type="submit" value="UPDATE"/>
            </form>
        </div>
    );
}

