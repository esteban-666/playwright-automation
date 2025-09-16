package com.hackerrank.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import java.util.List;

public class ContactUsPageDetector {
    
    /**
     * Finds a contact form on the given page based on specific criteria:
     * - Form must have at least 2 input text boxes (non-hidden)
     * - Form must have at least one submit button (non-hidden)
     * - Form must have method="post" (case-insensitive)
     * 
     * @param contactPage The URL of the page to check
     * @param driver The WebDriver instance
     * @return The form WebElement if found, null otherwise
     */
    public WebElement findContactForm(String contactPage, WebDriver driver) {
        try {
            // Navigate to the contact page
            driver.get(contactPage);
            
            // Find all forms on the page
            List<WebElement> forms = driver.findElements(By.tagName("form"));
            
            // Check each form
            for (WebElement form : forms) {
                // Check if form has method="post" (case-insensitive)
                String method = form.getAttribute("method");
                if (method == null || !method.equalsIgnoreCase("post")) {
                    continue; // Skip forms that don't have method="post"
                }
                
                // Find all input elements within this form
                List<WebElement> inputs = form.findElements(By.tagName("input"));
                
                int textInputCount = 0;
                int submitButtonCount = 0;
                
                for (WebElement input : inputs) {
                    String type = input.getAttribute("type");
                    
                    // Skip if input is hidden (check both type attribute and CSS)
                    if (type != null && type.equalsIgnoreCase("hidden")) {
                        continue;
                    }
                    
                    // Also check if element is displayed (not hidden via CSS)
                    if (!input.isDisplayed()) {
                        continue;
                    }
                    
                    // Count text inputs (type="text" or type="email" or no type specified)
                    if (type == null || type.equalsIgnoreCase("text") || 
                        type.equalsIgnoreCase("email") || type.equalsIgnoreCase("tel") ||
                        type.equalsIgnoreCase("url") || type.equalsIgnoreCase("search") ||
                        type.equalsIgnoreCase("number") || type.equalsIgnoreCase("password")) {
                        textInputCount++;
                    }
                    // Count submit buttons
                    else if (type != null && type.equalsIgnoreCase("submit")) {
                        submitButtonCount++;
                    }
                }
                
                // Also check for button elements with type="submit"
                List<WebElement> buttons = form.findElements(By.tagName("button"));
                for (WebElement button : buttons) {
                    String type = button.getAttribute("type");
                    
                    // Skip hidden buttons
                    if (!button.isDisplayed()) {
                        continue;
                    }
                    
                    // Count submit buttons (button with type="submit" or no type specified)
                    if (type == null || type.equalsIgnoreCase("submit")) {
                        submitButtonCount++;
                    }
                }
                
                // Check if form meets the criteria
                if (textInputCount >= 2 && submitButtonCount >= 1) {
                    return form; // Return the first form that meets criteria
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null; // No valid contact form found
    }
    
    /**
     * Alternative implementation with more lenient text input detection
     */
    public WebElement findContactFormAlternative(String contactPage, WebDriver driver) {
        try {
            driver.get(contactPage);
            
            // Use XPath to find forms with method="post" (case-insensitive)
            List<WebElement> forms = driver.findElements(
                By.xpath("//form[translate(@method, 'POST', 'post')='post']")
            );
            
            for (WebElement form : forms) {
                // Count visible text inputs using XPath
                List<WebElement> textInputs = form.findElements(
                    By.xpath(".//input[" +
                        "not(translate(@type, 'HIDDEN', 'hidden')='hidden') and " +
                        "(not(@type) or " +
                        "translate(@type, 'TEXT', 'text')='text' or " +
                        "translate(@type, 'EMAIL', 'email')='email' or " +
                        "translate(@type, 'TEL', 'tel')='tel' or " +
                        "translate(@type, 'URL', 'url')='url' or " +
                        "translate(@type, 'SEARCH', 'search')='search' or " +
                        "translate(@type, 'NUMBER', 'number')='number' or " +
                        "translate(@type, 'PASSWORD', 'password')='password')]")
                );
                
                // Count visible submit buttons (both input and button elements)
                List<WebElement> submitButtons = form.findElements(
                    By.xpath(".//input[translate(@type, 'SUBMIT', 'submit')='submit'] | " +
                            ".//button[not(@type) or translate(@type, 'SUBMIT', 'submit')='submit']")
                );
                
                // Filter out hidden elements
                int visibleTextInputs = 0;
                for (WebElement input : textInputs) {
                    if (input.isDisplayed()) {
                        visibleTextInputs++;
                    }
                }
                
                int visibleSubmitButtons = 0;
                for (WebElement button : submitButtons) {
                    if (button.isDisplayed()) {
                        visibleSubmitButtons++;
                    }
                }
                
                if (visibleTextInputs >= 2 && visibleSubmitButtons >= 1) {
                    return form;
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }
}