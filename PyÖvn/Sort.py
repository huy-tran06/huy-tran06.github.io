import random

# List with random numbers
random_list = []
for i in range(50):
    random_list.append(random.randint(1, 10000))

length_minus_one = len(random_list) - 1

# Bubble Sort
def bubble_sort():
    list = random_list.copy()

    for i in range(length_minus_one):
        for o in range(length_minus_one - i):
            if (list[o] > list[o + 1]):
                list[o], list[o + 1] = list[o + 1], list[o]

    return print(list)

#Selection Sort
def selection_sort():
    list = random_list.copy()

    for i in range(length_minus_one):
        smallest = i

        for o in range(i + 1, len(list)):
            if (list[o] < list[smallest]):
                smallest = o
        
        list[i], list[smallest] = list[smallest], list[i]

    return print(list)

#Insertion Sort
def insertion_sort():
    list = random_list.copy()
    
    for i in range(1, len(list)):
        the_one_moving = list[i]
        o = i - 1

        while(o >= 0 and list[o] > the_one_moving):
            list[o + 1] = list[o]
            o -= 1
    
        list[o + 1] = the_one_moving
    return print(list)

print(random_list)
# bubble_sort()
# selection_sort()
insertion_sort()