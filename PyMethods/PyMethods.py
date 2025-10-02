class Bok:
    _hemlig_kod = 50
    __hemligaste_kod = 100
    antal_böcker = 0

    def __init__(self, titel, författare, utgivningsår):
        self._titel = titel
        self._författare = författare
        self._utgivningsår = utgivningsår

        Bok.antal_böcker += 1

    def __str__(self):
        return f"Title: {self._titel}, Författare: {self._författare}, Utgivningsår: {self._utgivningsår}"
    
    @classmethod 
    def visa_antal_böcker(cls):
        return f"Antal skapade böcker: {cls.antal_böcker}"
    
    @staticmethod
    def är_gammal_bok(år):
        if år < 1900:
            return True
        else:
            return False
        
bok1 = Bok("Glimpse", "Jonathan Maberry", 2018)
bok2 = Bok("Sword of Destiny", "Andrzej Sapkowski", 2022)
bok3 = Bok("Crooked Kingdom", "Leigh Bardugo", 2018)

print(Bok.visa_antal_böcker())
print(Bok.är_gammal_bok(1899))
print(Bok._hemlig_kod)
print(Bok._Bok__hemligaste_kod)