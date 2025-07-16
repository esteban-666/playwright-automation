// Declare a variable with a string value
let message: string | number = 'Hello';

// Reassign the variable with a number value
message = 5;

// Define a function to add two numbers
function add(a: number, b: number): number {
  return a + b;
}

// Call the add function with arguments 3 and 4
add(3, 4);

// Define an interface for a Person object
interface Person {
  name: string;
  age: number;
  favoriteColor?: string;
}

// Create a Person object
const person: Person = { name: 'Alice', age: 25 };

// Add a favorite color property to the person object
person.favoriteColor = 'blue';

// Import the expect assertion library from Playwright
import { expect } from '@playwright/test';

// Define a class for PersonClass
class PersonClass {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
} 