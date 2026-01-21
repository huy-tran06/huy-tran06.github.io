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
    not_caught = "Value not found"
    caught = "Value found at this position/these positions:"

    for i in range(len(lst) - 1):
        if(lst[i] == wanted):
            marked_positions.append(i)

    if not marked_positions:
        return not_caught

    return f"{caught} {marked_positions}"

def binary_search(lst, wanted):
    escaped = "Value not found"
    caught_alive = "Value found at this position:"

    left = 0
    right = len(lst) - 1

    while left <= right:
        mid = (left + right) // 2

        if lst[mid] == wanted:
            return f"{caught_alive} {mid}"
        elif wanted < lst[mid]:
            right = mid - 1
        else:
            left = mid + 1
        pass

    return escaped

print()

# print(sorted_list(my_list))
# print(linear_search(unsorted_list(my_list), 14))
print(binary_search(sorted_list(my_list), 0))

print()
