class Person:
    def __init__ (self, namn, personnummer):
        self.namn = namn
        self.personnummer = personnummer
        
    def beskrivning(self):
        return f"Namn: {self.namn}, Personnummer: {self.personnummer}"
    
    def hälsa(self):
        return f"Hej, jag heter {self.namn}."

class Anställd(Person):
    def __init__(self, namn, personnummer, anställningsnummer):
        super().__init__(namn, personnummer)
        self.anställningsnummer = anställningsnummer

    def beskrivning(self):
        return super().beskrivning() + f", Anställningsnummer: {self.anställningsnummer}"
    
    def hälsa(self):
        return f"Hej, jag heter {self.namn} och jag är jobbar här."

class Lärare(Anställd):
    def __init__(self, namn, personnummer, anställningsnummer, ämne):
        super().__init__(namn, personnummer, anställningsnummer)
        self.ämne = ämne
    
    def beskrivning(self):
        return super().beskrivning() + f", Ämne: {self.ämne}"
    
    def hälsa(self):
        return f"Hej, jag heter {self.namn} och jag undervisar i {self.ämne}."

class Rektor(Anställd):
    def __init__(self, namn, personnummer, anställningsnummer, ansvarsområde):
        super().__init__(namn, personnummer, anställningsnummer)
        self.ansvarsområde = ansvarsområde
    
    def beskrivning(self):
        return super().beskrivning() + f", Ansvarsområde: {self.ansvarsområde}"

    def hälsa(self):
        return f"Hej, jag heter {self.namn} och jag ansvarar för {self.ansvarsområde}."