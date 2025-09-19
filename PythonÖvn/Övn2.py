class Fordon:
    def __init__(self, märke, modell, år):
        self.märke = märke
        self.modell = modell
        self.år = år

    def beskrivning(self):
        return f"Märke: {self.märke}, Modell: {self.modell}, År: {self.år}"
    
    def är_veteran(self):
        if self.år < 1995:
            return True

    class Bil(Fordon):
        def __init__(self, märke, modell, år, antal_dörrar):
            super().__init__(märke, modell, år)
            self.antal_dörrar = antal_dörrar

        def beskrivning(self):
            return super().beskrivning() + f", Antal dörrar: {self.antal_dörrar}"

    class Motorcykel(Fordon):
        def __init__(self, märke, modell, år, har_sidovagn):
            super().__init__(märke, modell, år)
            self.har_sidovagn = har_sidovagn

        def beskrivning(self):
            sidovagn_status = "Ja" if self.har_sidovagn else "Nej"
            return super().beskrivning() + f", Har sidovagn: {sidovagn_status}"

fordon_lista = [
    Bil("Tesla", "Model S", 2020, 4),
    Motorcykel("Yamaha", "MT-07", 2018, False),
    Bil("Volvo", "240", 1990, 4),
    Motorcykel("Harley-Davidson", "Softail", 1992, True)
]

for fordon in fordon_lista:
    print(fordon.beskrivning())
    print("Veteran: Ja" if fordon.är_veteran() else "Veteran: Nej")
    print("-----------")


