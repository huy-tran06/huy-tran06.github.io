async function getProducts(){
    
    const response = await fetch("info.json");
    const data = await response.json();
}