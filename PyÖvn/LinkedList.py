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

    def prepend(self, value):
        new_node = Node(value)
        new_node._next = self._head
        self._head = new_node

        if self._head is None:
            self._tail = new_node
        
        self._length += 1

    def insert(self, index, value):
        if index >= self._length:
            self.append(value)
            return
        
        if index <= 0:
            self.prepend(value)
            return

        if index > 0:
            new_node = Node(value)
            e = self._head

            for i in range(index-1):
                e = e._next
            
            new_node._next = e._next
            e._next = new_node

            self._length += 1

    def remove(self, value):
        current = self._head
        previous = None

        for i in range(self._length):
            previous = current
            current = current._next
            

    def size(self):
        return self._length

    def isEmpty(self):
        return self._head is None