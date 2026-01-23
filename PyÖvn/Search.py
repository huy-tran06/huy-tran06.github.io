import random
import time

my_list = []

# Lists
def unsorted_list(lst):
    for i in range(20000):
        lst.append(random.randint(1, 20000))

    return lst

def sorted_list(lst):
    for i in range(10):
        lst.append(i)

    return lst

# Algorithms 
def linear_search(lst, wanted):
    marked_positions = []
    not_caught = "Not caught"
    caught = "Caught at:"

    start = time.perf_counter()
    for i in range(len(lst) - 1):
        if(lst[i] == wanted):
            marked_positions.append(i)

    if not marked_positions:
        result = round(time.perf_counter() - start, 5)
        return f"{result}s {not_caught}"

    result = round(time.perf_counter() - start, 5)
    return f"{result}s {caught} {marked_positions}"

def binary_search(lst, wanted):
    not_caught = "Not caught"
    caught = "Caught at:"

    left = 0
    right = len(lst) - 1

    while left <= right:
        mid = (left + right) // 2

        if lst[mid] == wanted:
            return f"{caught} {mid}"
        elif wanted < lst[mid]:
            right = mid - 1
        else:
            left = mid + 1
        pass

    return not_caught

print()

# print(sorted_list(my_list))
print(linear_search(unsorted_list(my_list), 14))
# print(binary_search(sorted_list(my_list), 0))

print()
