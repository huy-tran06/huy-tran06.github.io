import random
import time

chosen_list = []

# List with random numbers
def gen_list1():
    random_list = []

    for i in range(20000):
        random_list.append(random.randint(1, 200000))
    
    return random_list
    
# List with a few unique numbers
def gen_list2():
    test_list2 = []

    for i in range(20000):
        test_list2.append(random.randint(0, 3))
    
    return test_list2

# Mostly organized lst
def gen_list3():
    test_list3 = []

    for i in range(20000):
        test_list3.append(i)

    inserts = len(test_list3) // 10

    for o in range(inserts):
        value = random.randint(0, 2000)
        position = random.randint(0, len(test_list3))
        test_list3.insert(position, value)

    return test_list3

# Backwards sorted lst
def gen_list4():
    test_list4 = []
    i = 20000
    
    while i >= 0:
        test_list4.append(i)
        i -= 1

    return test_list4



# Bubble Sort
def bubble_sort():
    lst = chosen_list.copy()
    length_minus_one = len(lst) - 1

    start = time.perf_counter()
    for i in range(length_minus_one):
        for o in range(length_minus_one - i):
            if (lst[o] > lst[o + 1]):
                lst[o], lst[o + 1] = lst[o + 1], lst[o]
    result = round(time.perf_counter() - start, 2)

    return result

#Selection Sort
def selection_sort():
    lst = chosen_list.copy()
    length_minus_one = len(lst) - 1

    start = time.perf_counter()
    for i in range(length_minus_one):
        smallest = i

        for o in range(i + 1, len(lst)):
            if (lst[o] < lst[smallest]):
                smallest = o
        
        lst[i], lst[smallest] = lst[smallest], lst[i]
    result = round(time.perf_counter() - start, 2)

    return result

#Insertion Sort
def insertion_sort():
    lst = chosen_list.copy()
    
    start = time.perf_counter()
    for i in range(1, len(lst)):
        the_one_moving = lst[i]
        o = i - 1

        while(o >= 0 and lst[o] > the_one_moving):
            lst[o + 1] = lst[o]
            o -= 1
    
        lst[o + 1] = the_one_moving
    result = round(time.perf_counter() - start, 2)

    return result

#Python Sort
def python_sort():
    lst = chosen_list.copy()

    start = time.perf_counter()
    lst.sort()
    result = round(time.perf_counter() - start, 5)
    
    return result

chosen_list = gen_list1()
print("Random numbers:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("")


chosen_list = gen_list2()
print("Few unique numbers:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("")


chosen_list = gen_list3()
print("Mostly organized list:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("")


chosen_list = gen_list4()
print("Backwards sorted list:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("")