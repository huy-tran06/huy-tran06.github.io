class List:
    def __init__(self, capacity=4):
        """Skapar en ny lista med given startkapacitet."""
        self._data = [None] * capacity   # "array" med defaultvärden
        self._size = 0                   # antal faktiska element
        self._capacity = capacity

    def checkIfFull(self):
        if self._size == self._capacity:
            new_capacity = self._capacity * 2
            new_data = [None] * new_capacity

            for i in range(self._size):
                new_data[i] = self._data[i]
        
            self._data = new_data
            self._capacity = new_capacity
 
    def checkIndexValidity(self, index):
        if index < 0 or index >= self._size:
            raise IndexError("Index out of bounds.") 

    def append(self, value):
        """Lägg till ett värde sist i listan."""
        # TODO: kolla om arrayen är full -> skapa ny, större array och kopiera

        self.checkIfFull()

        self._data[self._size] = value
        self._size += 1
 
    def insert(self, index, value):
        """Lägg in ett värde på en viss position."""
        # TODO: flytta elementen åt höger, sätt in värdet på rätt plats

        self.checkIndexValidity()
        self.checkIfFull()

        for i in range(self._size, index, -1):
            self._data[i] = self._data[i -1]

        self._data[index] = value
        self._size += 1
        
    def remove(self, value):
        """Ta bort första förekomsten av ett värde."""
        # TODO: hitta index för värdet, flytta elementen åt vänster
        soonDeleted = -1
        for i in range(self._size):
            if self._data[i] == value:
                soonDeleted = i
                break

        if soonDeleted == -1:
            raise ValueError(f"{value} not found in list.")

        for i in range(soonDeleted, self._size - 1):
            self._data[i] = self._data[i + 1]
        
        self._data[self._size - 1] = None
        self._size -= 1
 
    def pop(self, index = None):
        """Ta bort och returnera elementet på en viss position (eller sist)."""
        
        if index is None:
            index = self._size - 1

        self.checkIndexValidity(index)

        value = self._data[index]

        for i in range(index, self._size - 1):
            self._data[i] = self._data[i + 1]

        self._data[self._size - 1] = None
        self._size -= 1
        return value
 
    def get(self, index):
        """Returnera värdet på en viss position."""

        self.checkIndexValidity(index)
        return self._data[index]
 
    def set(self, index, value):
        """Ändra värdet på en viss position."""

        self.checkIndexValidity(index)
        self._data[index] = value
 
    def size(self):
        """Returnerar antal element."""

        return self._size
 
    def isEmpty(self):
        """Returnerar True/False beroende på om listan är tom."""
        
        return self._size == 0
 
    def __str__(self):
        """Returnerar en strängrepresentation, t.ex. [1, 2, 3]."""
        values = [self._data[i] for i in range(self._size)]
        return str(values)
 
l = List()