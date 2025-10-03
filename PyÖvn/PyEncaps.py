class Account:
    __account_count = 0

    def __init__(self, username, password, role="Guest", active=True):
        self.__username = username
        self.__password = password
        self.__role = role
        self.__active = active
        
        Account.__account_count += 1

    @property
    def username(self):
        return self.__username

    @property
    def password(self):
        return self.__password
    
    @password.setter
    def password(self, new_password):
        if len(new_password) >= 6:
            self.__password = new_password

    @property
    def role(self):
        return self.__role
    
    @role.setter
    def role(self, new_role):
        allowed = ["admin", "member", "guest"]
        if new_role.lower() in allowed:
            self.__role = new_role


    def __str__(self):
        if self.__active == True:
            return f"Username: {self.__username}, Password: {self.__password}, Role: {self.__role}, Status: Active"
        if self.__active == False:
            return f"Username: {self.__username}, Password: {self.__password}, Role: {self.__role}, Status: Inactive"
        
    