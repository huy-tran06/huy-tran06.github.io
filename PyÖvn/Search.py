import random

my_list = []

# Lists
def sorted_list(lst):
    for i in range(10):
        lst.append(i)

    return lst

def unsorted_list(lst):
    for i in range(100000):
        lst.append(random.randint(1, 100000))

    return lst


# Algorithms 
def linear_search(lst, wanted):
    marked_positions = []
    not_found = "Value not found"
    found = "Value found at this position/these positions:"

    for i in range(len(lst) - 1):
        if(lst[i] == wanted):
            marked_positions.append(i)

    if not marked_positions:
        return not_found

    return f"{found} {marked_positions}"

def binary_search(lst, wanted):
    marked_positions = []
    
    pass



print()

# print(sorted_list(my_list))
print(linear_search(unsorted_list(my_list), 14))

print()
