class Node:
    def __init__(self, value):
        self._value = value
        self._next = None 

class LinkedList:
    def __init__(self):
        self._head = None
        self._tail = None
        self._length = 0

    def append(self, value):
        new_node = Node(value)

        if self._head is None:
            self._head = new_node
            self._tail = new_node
        else:
            self._tail._next = new_node
            self._tail = new_node

        self._length += 1    

    def isEmpty(self):
        return self._length == 0