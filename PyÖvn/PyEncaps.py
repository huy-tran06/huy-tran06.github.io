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

    @username.setter
    def username(self, new_username):
        if len(new_username) > 0:
            self.__username = new_username

    def __str__(self):
        if self.__active == True:
            return f"Username: {self.__username}, Password: {self.__password}, Role: {self.__role}, Status: Active"
        if self.__active == False:
            return f"Username: {self.__username}, Password: {self.__password}, Role: {self.__role}, Status: Inactive"
        
    