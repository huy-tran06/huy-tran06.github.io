import random

my_list = []

# Lists
def sorted_list(lst):
    for i in range(10):
        lst.append(i)

    return lst

def unsorted_list(lst):
    for i in range(100):
        lst.append(random.randint(1, 100))

    return lst


# Algorithms 
def linear_search(lst, wanted):
    marked_positions = []

    for i in range(len(lst) - 1):
        if(lst[i] == wanted):
            marked_positions.append(i)

    return marked_positions

def binary_search(lst, wanted):
    marked_positions = []
    
    pass



print()

# print(sorted_list(my_list))
print("Value found at this position/these positions:", linear_search(unsorted_list(my_list), 14))

print()
