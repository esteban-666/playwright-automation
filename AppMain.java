package com.hackerrank.selenium;

import com.hackerrank.selenium.db.Database;
import com.hackerrank.selenium.db.Website;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Main application class to demonstrate the Contact Page Detection functionality
 */
public class AppMain {
    
    public static void main(String[] args) {
        // Suppress HtmlUnit warnings for cleaner output
        Logger.getLogger("com.gargoylesoftware").setLevel(Level.OFF);
        
        System.out.println("=== Contact Page Detection System ===\n");
        
        // Part 1: Database - Fetch contact pages
        System.out.println("1. Fetching contact pages from database...");
        testDatabaseFunctionality();
        
        System.out.println("\n" + "=".repeat(50) + "\n");
        
        // Part 2: Selenium - Detect contact forms
        System.out.println("2. Detecting contact forms on web pages...");
        testSeleniumFunctionality();
        
        System.out.println("\n=== Tests completed successfully! ===");
    }
    
    /**
     * Test the Database functionality
     */
    private static void testDatabaseFunctionality() {
        try {
            Database database = new Database();
            List<Website> contactPages = database.fetchContactPages();
            
            System.out.println("Found " + contactPages.size() + " contact pages:");
            System.out.println("-".repeat(40));
            
            for (Website page : contactPages) {
                System.out.println("ID: " + page.getId());
                System.out.println("Path: " + page.getPath());
                System.out.println("URL: " + page.getUrl());
                System.out.println("Path Length: " + page.getPath().length());
                
                // Verify criteria
                String lowerPath = page.getPath().toLowerCase();
                boolean hasKeyword = lowerPath.contains("contact") || 
                                    lowerPath.contains("support") || 
                                    lowerPath.contains("feedback");
                boolean lengthOk = page.getPath().length() < 12;
                
                System.out.println("✓ Contains keyword: " + hasKeyword);
                System.out.println("✓ Length < 12: " + lengthOk);
                System.out.println("-".repeat(40));
            }
            
            database.close();
            
        } catch (Exception e) {
            System.err.println("Database test failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Test the Selenium functionality
     */
    private static void testSeleniumFunctionality() {
        WebDriver driver = null;
        
        try {
            // Initialize HtmlUnitDriver
            driver = new HtmlUnitDriver(true); // Enable JavaScript
            ContactUsPageDetector detector = new ContactUsPageDetector();
            
            // Test Case 1: Valid contact form
            System.out.println("Test 1: Valid Contact Form");
            System.out.println("-".repeat(40));
            String validFormHtml = createValidContactFormHtml();
            String testUrl = "data:text/html;charset=utf-8," + validFormHtml;
            
            WebElement form = detector.findContactForm(testUrl, driver);
            if (form != null) {
                System.out.println("✓ Found valid contact form");
                System.out.println("  Method: " + form.getAttribute("method"));
                System.out.println("  Action: " + form.getAttribute("action"));
            } else {
                System.out.println("✗ No valid contact form found");
            }
            
            // Test Case 2: Invalid form (GET method)
            System.out.println("\nTest 2: Invalid Form (GET method)");
            System.out.println("-".repeat(40));
            String invalidFormHtml = createInvalidFormHtml();
            testUrl = "data:text/html;charset=utf-8," + invalidFormHtml;
            
            form = detector.findContactForm(testUrl, driver);
            if (form == null) {
                System.out.println("✓ Correctly rejected form with GET method");
            } else {
                System.out.println("✗ Incorrectly accepted invalid form");
            }
            
            // Test Case 3: Form with hidden inputs
            System.out.println("\nTest 3: Form with Hidden Inputs");
            System.out.println("-".repeat(40));
            String hiddenInputsHtml = createFormWithHiddenInputs();
            testUrl = "data:text/html;charset=utf-8," + hiddenInputsHtml;
            
            form = detector.findContactForm(testUrl, driver);
            if (form != null) {
                System.out.println("✓ Found form (hidden inputs correctly ignored)");
            } else {
                System.out.println("✗ Failed to find valid form");
            }
            
        } catch (Exception e) {
            System.err.println("Selenium test failed: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (driver != null) {
                driver.quit();
            }
        }
    }
    
    /**
     * Create HTML for a valid contact form
     */
    private static String createValidContactFormHtml() {
        return "<!DOCTYPE html><html><body>" +
               "<h1>Contact Us</h1>" +
               "<form method='POST' action='/submit'>" +
               "<input type='text' name='firstName' placeholder='First Name'/>" +
               "<input type='text' name='lastName' placeholder='Last Name'/>" +
               "<input type='email' name='email' placeholder='Email'/>" +
               "<input type='tel' name='phone' placeholder='Phone'/>" +
               "<input type='submit' value='Send'/>" +
               "</form></body></html>";
    }
    
    /**
     * Create HTML for an invalid form (GET method)
     */
    private static String createInvalidFormHtml() {
        return "<!DOCTYPE html><html><body>" +
               "<h1>Search Form</h1>" +
               "<form method='GET' action='/search'>" +
               "<input type='text' name='query' placeholder='Search'/>" +
               "<input type='text' name='category' placeholder='Category'/>" +
               "<input type='submit' value='Search'/>" +
               "</form></body></html>";
    }
    
    /**
     * Create HTML for a form with hidden inputs
     */
    private static String createFormWithHiddenInputs() {
        return "<!DOCTYPE html><html><body>" +
               "<h1>Contact Form</h1>" +
               "<form method='post' action='/contact'>" +
               "<input type='hidden' name='csrf' value='token123'/>" +
               "<input type='hidden' name='form_id' value='contact'/>" +
               "<input type='text' name='name' placeholder='Name'/>" +
               "<input type='email' name='email' placeholder='Email'/>" +
               "<input type='hidden' name='timestamp' value='123456'/>" +
               "<button type='submit'>Submit</button>" +
               "</form></body></html>";
    }
}