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

### Analys
Körtiden är ungefär relativt till antalet element som finns i listan. Om listan blir dubbel så stor så tar det också ungefär dubbel så lång tid att söka igenom. Detta innebär att ju färre element det finns i listan desto snabbare algoritmen kommer att avslutas och vice versa. Därför är linjär sökning ett rimligt val när man har små listor att söka genom eller när man bara vill skriva en enkel sökningsalgoritm som fungerar.



## Binär sökning
Algoritmen placerar sig först i mitten av listan och returnerar värdet som ligger i mitten av listan, "mid" i detta fallet, om det är det värdet användaren letar efter, "wanted". Om "mid" inte matchar med "wanted" så kommer algoritmen att se om "wanted" är mindre eller större än "mid". När "wanted" är mindre än "mid", så ändras 