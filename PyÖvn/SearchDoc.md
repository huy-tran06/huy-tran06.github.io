# LAB - Sökalgoritmer
## Linjär sökning
Algoritmen letar först genom listan element för element och markera alla positioner som innehåller värdet användaren letar efter. Positionerna läggs sedan in i en annan lista som senare returneras tillbaka till användaren. 

```python
def linear_search(lst, wanted):
    marked_positions = []
    not_caught = "Not caught"
    caught = "Caught at:"

    start = time.perf_counter()
    for i in range(len(lst) - 1):
        if(lst[i] == wanted):
            marked_positions.append(i)

    if not marked_positions:
        result = round(time.perf_counter() - start, 5)
        return f"{result}s {not_caught}"

    result = round(time.perf_counter() - start, 5)
    return f"{result}s {caught} {marked_positions}"

```

## Linjär sökning analys
Körtiden är ungefär relativt till antalet element som finns i listan. Om listan blir dubbel så stor så tar det också ungefär dubbel så lång tid att söka igenom. Detta innebär att ju färre element det finns i listan desto snabbare algoritmen kommer att avslutas och vice versa. Därför 