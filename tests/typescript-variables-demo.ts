// Import Playwright's expect and type definitions
import { expect, type Locator, type Page } from '@playwright/test';

// Declare a string variable and reassign it
let message1 : string = "Hello";
message1 = "bye";
console.log(message1);

// Declare a number variable and log it
let age1:number = 20;
console.log(age1);

// Declare a boolean variable
let isActive : boolean = false;

// Declare a number array
let numberArry : number[] = [1,2,3];

// Demonstrate use of 'any' type
let data : any = "this could be anything";
data =42;

// Define a function to add two numbers
function add(a:number,b:number): number
{
    return a+b;
}

// Call the add function
add(3,4);

// Create a user object with name, age, and location
let user: {name:string,age:number,location:string} = { name: "Bob",age:34,location:"delhi"};

// Update the user's location
user.location = "hyderabad";

// (No test code present, so not renaming to .spec.ts)















