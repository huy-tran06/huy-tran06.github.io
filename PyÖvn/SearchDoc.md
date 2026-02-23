# LAB - Sökalgoritmer
## Del 1: Linjär sökning
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
Körtiden är proportionell till antalet element som finns i listan. Om listan blir dubbel så stor så tar det också ungefär dubbel så lång tid att söka igenom. Detta innebär att ju färre element det finns i listan desto snabbare algoritmen kommer att avslutas och vice versa. Därför är linjär sökning ett rimligt val när man har små listor att söka genom eller när man bara vill skriva en enkel sökningsalgoritm som fungerar.



## Del 2: Binär sökning
Algoritmen börjar med att titta på mitten av listan. Om värdet i mitten, `mid`, är det värdet användaren leter efter, `wanted`, så returneras det direkt. Om `mid` inte matchar `wanted` jämför algoritmen istället om `wanted` är mindre eller större än `mid`. Om `wanted` är mindre än `mid` flyttas den högra gränsen, `right`, så att sökningen fortsätter i den vänstra halvan av listan. Om `wanted` är större än `mid` flyttas istället den vänstra gränsen, `left`, och sökningen fortsätter i den högra halvan. 

På detta sättet kräver binär sökning sorterad data för att kunna fungera som den ska. Om datan inte är sorterad så kan `wanted` vara mindre än `mid` men ändå ligger i den högra halvan av listan.

```python
def binary_search(lst, wanted):
    not_caught = "Not caught"
    caught = "Caught at:"

    left = 0
    right = len(lst) - 1

    while left <= right:
        mid = (left + right) // 2

        if lst[mid] == wanted:
            return f"{caught} {mid}"
        elif wanted < lst[mid]:
            right = mid - 1
        else:
            left = mid + 1
        pass

    return not_caught
```

### Analys
Binär sökning halverar listan varje gång den jämför `mid` med `wanted`. Vilket betyder att algoritmen inte behöver kolla varje element utan bara snabbt kan eliminera hälften av listan vid varje steg. Det behövs bara 20 steg för en lista med 1 000 000 element eftersom man bara kan dela 1 000 000 i häften 20 gånger men om man hade använt linjär sökning istället så hade det behövt, i värsta fall, alla 1 000 000 stegen som motsvara alla element. Däremot finns det också situationer där binär sökning inte är lämplig som till exempel i osorterade listor där binär sökning inte fungerar alls.



## Del 3: Jämförelse och tidskomplexitet

### Tidskomplexitet
Tidskomplexitet beskriver hur snabbt en algoritm växer i arbetsmängd när datan blir större.

### Big-O-notation
Big-O-notation är ett sätt att beskriva algoritmers tidskomplexitet. Det visar hur algoritmens körtid växer när inputen (n) blir större och vilka beteende algoritmen har i värsta fall.

Linjär sökning har till exempel O(n) vilket är linjär tid och innebär att tiden ökar proportionellt med antalet element.

Binär sökning har däremot O(log n) som är logaritmisk tid och innebär att algoritmen halverar problemet varje steg. 

### Resonemangsfrågor
#### Varför spelar algoritmval större roll än programmeringsspråk vid stora datamängder? 
Det är för att det oftast är algoritmens effektivitet som avgör hur snabbt ett program körs, inte vilket språk man använder. Om man tar till exempel en lista med 1 000 000 element då behöver en linjär sökning upp till 1 000 000 steg medan en binär sökning bara behöver upp till 20 steg. Det finns ingen optimering i språket som kan kompensera för en så stor skillnad. 

#### Hur påverkar datamängdens storlek valet av algoritm?
Ju större datamängden är desto viktigare det blir att välja en algorim med låg tidskomplexitet. För små problem kan enkla algoritmer fungera bra medan för större problem måste man välja algoritmer som skalar bättre. 



## Del 4: Hash tables (teori och analys)

### Frågor
#### 1. Vad är en hash table?
En hash table är en datastruktur som lagrar data och använder en hashfunktion för att räkna ut var i en intern array ett värde ska lagras vilket gör att det blir mycket snabbt när man ska söka, sätta in och ta bort element.

#### 2. Vad är en hashfunktion och vilket problem löser den? 
En hashfunktion tar en nyckel, som till exempel ett namn eller ett ID, och omvandlar den till ett heltal som motsvarar ett index i arrayen. Vilket gör det möjligt att snabbt hitta rätt plats i minnet utan att behöva söka igenom alla element.

#### 3. Vad innebär begreppet kollision?
Det är när två olika nycklar får samma hashvärde vilket gör att de då hamnar på samma plats i hash table.

#### 4. Beskriv minst två olika strategier för att hantera kollisioner.
Separate chaining är ett sätt att hanterna kollisioner som innebär att varje plats i hash table innehåller en lista som används för att lagra alla värden som krockar.

Open addressing lagrar däremot alla element direkt i hash-tabellens array till skillnad från separata listor som i separate chaining. Om en plats är upptagen letar man efter nästa lediga plats enligt ett mönster. Som till exempel Linear probing, Quadratic probing eller Double hashing.

#### 5. Vad menas med genomsnittlig respektive värsta fall-tidskomplexitet?
Genomsnittlig tidskomplexitet är hur lång tid en operation tar i snitt. Medan värsta fall-tidskomplexitet är hur lång tid operationen kan ta i det sämsta tänkbara scenariot.

#### 6. Varför sägs det att uppslag i en hash table oftast är O(1)?
För att hashfunktionen direkt räknar ut exakt var ett element finns. Man går direkt till rätt plats och ingen sökning behövs.


### Analys
#### Sökning i en osorterad lista
När man söker genom en osorterad lista måste man kolla genom alla element tills det sökta värdet hittas eller listan tar slut. Detta innebär att tidskomplexiteten i både genomsnittligt och värsta fall är O(n) eftersom man i värsta fall måste gå igenom alla element. Fördelen med en osorterad lista är att den är mycket minneseffetiv och enkel att implementera eftersom den inte kräver någon extra datastruktur utöver själva listan. Metoden är lämplig när datamängden är liten eller när listan ofta förändras genom insättningar och borttagningar.

#### Sökning i en sorterad lista
