import random
import time
import bisect

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

# Selection Sort
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

# Insertion Sort
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

# Python Sort
def python_sort():
    lst = chosen_list.copy()

    start = time.perf_counter()
    lst.sort()
    result = round(time.perf_counter() - start, 5)
    
    return result



#AI

# Quick Sort
def optimized_quicksort(arr):
    start = time.perf_counter()

    def insertion_sort(a, left, right):
        for i in range(left + 1, right + 1):
            key = a[i]
            j = i - 1
            while j >= left and a[j] > key:
                a[j + 1] = a[j]
                j -= 1
            a[j + 1] = key

    def median_of_three(a, low, high):
        mid = (low + high) // 2
        if a[low] > a[mid]:
            a[low], a[mid] = a[mid], a[low]
        if a[low] > a[high]:
            a[low], a[high] = a[high], a[low]
        if a[mid] > a[high]:
            a[mid], a[high] = a[high], a[mid]
        return mid

    def quicksort(a, low, high):
        while low < high:
            # Use insertion sort for small partitions
            if high - low < 16:
                insertion_sort(a, low, high)
                return

            pivot_index = median_of_three(a, low, high)
            pivot = a[pivot_index]
            a[pivot_index], a[high] = a[high], a[pivot_index]

            i = low
            for j in range(low, high):
                if a[j] <= pivot:
                    a[i], a[j] = a[j], a[i]
                    i += 1

            a[i], a[high] = a[high], a[i]

            # Tail recursion optimization
            if i - low < high - i:
                quicksort(a, low, i - 1)
                low = i + 1
            else:
                quicksort(a, i + 1, high)
                high = i - 1

    quicksort(arr, 0, len(arr) - 1)
    result = round(time.perf_counter() - start, 5)
    return result

# Counting Sort
def counting_sort_small_range(arr, max_value=3):
    start = time.perf_counter()

    counts = [0] * (max_value + 1)

    # Count occurrences
    for num in arr:
        counts[num] += 1

    # Rebuild list
    index = 0
    for value in range(max_value + 1):
        for _ in range(counts[value]):
            arr[index] = value
            index += 1

    result = round(time.perf_counter() - start, 5)
    return result

# Binary Insertion Sort
def binary_insertion_sort(arr):
    start = time.perf_counter()

    for i in range(1, len(arr)):
        key = arr[i]

        # Skip if already in correct position
        if key >= arr[i - 1]:
            continue

        # Find correct position using binary search
        pos = bisect.bisect_left(arr, key, 0, i)

        # Shift elements
        arr[pos+1:i+1] = arr[pos:i]
        arr[pos] = key

    result = round(time.perf_counter() - start, 5)
    return result

# Adaptive Reverse Sort
def adaptive_reverse_sort(arr):
    start = time.perf_counter()

    n = len(arr)

    # Detect descending
    descending = True
    for i in range(n - 1):
        if arr[i] < arr[i + 1]:
            descending = False
            break

    if descending:
        arr.reverse()

        result = round(time.perf_counter() - start, 5)
        return result

    # Fallback: insertion sort (no built-ins)
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key

    result = round(time.perf_counter() - start, 5)
    return result



chosen_list = gen_list1()
print("Random numbers:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("ChatGPT's QuickSort:", optimized_quicksort(chosen_list), "s")
print("")


chosen_list = gen_list2()
print("Few unique numbers:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("ChatGPT's counting sort:", counting_sort_small_range(chosen_list), "s")
print("")


chosen_list = gen_list3()
print("Mostly organized list:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("ChatGPT's binary insertion sort:", binary_insertion_sort(chosen_list), "s")
print("")


chosen_list = gen_list4()
print("Backwards sorted list:")
print("Bubble sort:", bubble_sort(), "s")
print("Selection sort:", selection_sort(), "s")
print("Insertion sort:", insertion_sort(), "s")
print("Python sort:", python_sort(), "s")
print("ChatGPT's adaptive reverse sort:", adaptive_reverse_sort(chosen_list), "s")
print("")