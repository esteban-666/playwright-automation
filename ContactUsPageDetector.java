package com.hackerrank.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import java.util.List;

public class ContactUsPageDetector {
    
    public static WebElement findContactForm(String contactPage, WebDriver driver) {
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
                    
                    // Skip if input is hidden
                    if (type != null && type.equalsIgnoreCase("hidden")) {
                        continue;
                    }
                    
                    // Also check if element is displayed (not hidden via CSS)
                    if (!input.isDisplayed()) {
                        continue;
                    }
                    
                    // Count text inputs (handle case-insensitive and various text input types)
                    if (type == null || type.equalsIgnoreCase("text") || 
                        type.equalsIgnoreCase("email") || type.equalsIgnoreCase("tel") ||
                        type.equalsIgnoreCase("url") || type.equalsIgnoreCase("search") ||
                        type.equalsIgnoreCase("number") || type.equalsIgnoreCase("password")) {
                        textInputCount++;
                    }
                    // Count submit buttons (case-insensitive)
                    else if (type != null && type.equalsIgnoreCase("submit")) {
                        submitButtonCount++;
                    }
                }
                
                // Also check for button elements with type="submit"
                List<WebElement> buttons = form.findElements(By.tagName("button"));
                for (WebElement button : buttons) {
                    // Skip hidden buttons
                    if (!button.isDisplayed()) {
                        continue;
                    }
                    
                    String type = button.getAttribute("type");
                    // Count submit buttons (button with type="submit" or no type specified)
                    if (type == null || type.equalsIgnoreCase("submit")) {
                        submitButtonCount++;
                    }
                }
                
                // Check if form meets the criteria (at least 2 text inputs and 1 submit button)
                if (textInputCount >= 2 && submitButtonCount >= 1) {
                    return form; // Return the first form that meets criteria
                }
            }
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null; // No valid contact form found
    }
}