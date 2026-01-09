import random
import time

chosen_list = []

# List with random numbers
def gen_list1():
    random_list = []

    for i in range(50):
        random_list.append(random.randint(1, 1000))
    
    return random_list
    
# List with a few unique numbers
def gen_list2():
    test_list2 = []

    for i in range(50):
        test_list2.append(random.randint(0, 3))
    
    return test_list2

# Mostly organized list
def gen_list3():
    test_list3 = []

    for i in range(50):
        test_list3.append(i)

    inserts = len(test_list3) // 10

    for o in range(inserts):
        value = random.randint(0, 100)
        position = random.randint(0, len(test_list3))
        test_list3.insert(position, value)

    return test_list3

# Backwards sorted list
def gen_list4():
    test_list4 = []
    i = 50
    
    while i >= 0:
        test_list4.append(i)
        i -= 1

    return test_list4



# Bubble Sort
def bubble_sort():
    list = chosen_list.copy()
    length_minus_one = len(list) - 1

    for i in range(length_minus_one):
        for o in range(length_minus_one - i):
            if (list[o] > list[o + 1]):
                list[o], list[o + 1] = list[o + 1], list[o]

    return list

#Selection Sort
def selection_sort():
    list = chosen_list.copy()
    length_minus_one = len(list) - 1

    for i in range(length_minus_one):
        smallest = i

        for o in range(i + 1, len(list)):
            if (list[o] < list[smallest]):
                smallest = o
        
        list[i], list[smallest] = list[smallest], list[i]

    return list

#Insertion Sort
def insertion_sort():
    list = chosen_list.copy()
    
    for i in range(1, len(list)):
        the_one_moving = list[i]
        o = i - 1

        while(o >= 0 and list[o] > the_one_moving):
            list[o + 1] = list[o]
            o -= 1
    
        list[o + 1] = the_one_moving
    return list

chosen_list = gen_list1()
print("Random numbers:", chosen_list)
print(bubble_sort())
print(selection_sort())
print(insertion_sort())


chosen_list = gen_list2()
print("Few unique numbers:", chosen_list)
print(bubble_sort())
print(selection_sort())
print(insertion_sort())


chosen_list = gen_list3()
print("Mostly organized list:", chosen_list)
print(bubble_sort())
print(selection_sort())
print(insertion_sort())


chosen_list = gen_list4()
print("Backwards sorted list:", chosen_list)
print(bubble_sort())
print(selection_sort())
print(insertion_sort())