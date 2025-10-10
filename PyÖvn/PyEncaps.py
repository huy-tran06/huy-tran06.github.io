class Account:
    __account_count = 0

    def __init__(self, username, password, role="guest"):
        self.__username = username
        self.__password = password
        self.__role = role
        self.__active = True
        
        Account.__account_count += 1

    def __str__(self):
        if self.__active == True:
            return f"Username: {self.__username}, Password: {self.__password}, Role: {self.__role}, Status: Active"
        if self.__active == False:
            return f"Username: {self.__username}, Password: {self.__password}, Role: {self.__role}, Status: Inactive"
        
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

    def inactivate(self):
        self.__active = False

    def activate(self):
        self.__active = True

    def is_active(self):
        return self.__active
        
    def authenticate(self, username, password):
        if username == self.__username and password == self.__password:
            return True
        else:
            return False
        
    @classmethod
    def account_count(cls):
        return cls.__account_count


account1 = Account("Huy","1234567","Admin")
print(account1.username)


accounts = []

while True:
    
    print(" ")
    print("1. Create a new account")
    print("2. Show all accounts")
    print("3. Change password")
    print("4. Inactivate account")
    print("5. Activate account")
    print("6. Authenticate user")
    print("7. Show account count")
    print("8. Close")
    print(" ")

    val = input("Choose one option: ")
    
    if val == "1":
        username = input("Username: ")
        password = input("Password: ")
        role = input("Role (Admin, Member or Guest): ")

        try:
            account = Account(username, password, role)
            accounts.append(account)
            print("Account successfully created!")
        except ValueError as error:
            print(error)

    elif val == "2":
        print(" ")
        print("All created accounts:")
        for account in accounts:
            print(account)

    elif val == "3":
        username = input("Username: ")
        new_password = input("New password: ")
        for account in accounts:
            if account.username == username:
                account.password = new_password
                print("Password changed!")

    elif val == "8":
        print("Shutting down...")
        break