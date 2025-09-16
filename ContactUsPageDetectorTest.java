package com.hackerrank.selenium;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;

import static org.junit.Assert.*;

import java.io.File;

public class ContactUsPageDetectorTest {
    
    private WebDriver driver;
    private ContactUsPageDetector detector;
    
    @Before
    public void setUp() {
        // Initialize HtmlUnitDriver (headless browser)
        driver = new HtmlUnitDriver(true); // true enables JavaScript
        detector = new ContactUsPageDetector();
    }
    
    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    @Test
    public void testValidContactForm() {
        // Test with a valid contact form
        String testPage = "file://" + new File("test_contact_valid.html").getAbsolutePath();
        WebElement form = detector.findContactForm(testPage, driver);
        
        assertNotNull("Should find a valid contact form", form);
        assertEquals("Form method should be POST", "post", form.getAttribute("method").toLowerCase());
    }
    
    @Test
    public void testInvalidContactForm_NotEnoughInputs() {
        // Test with a form that has only 1 text input
        String testPage = "file://" + new File("test_contact_invalid_inputs.html").getAbsolutePath();
        WebElement form = detector.findContactForm(testPage, driver);
        
        assertNull("Should not find form with less than 2 text inputs", form);
    }
    
    @Test
    public void testInvalidContactForm_NoSubmitButton() {
        // Test with a form that has no submit button
        String testPage = "file://" + new File("test_contact_no_submit.html").getAbsolutePath();
        WebElement form = detector.findContactForm(testPage, driver);
        
        assertNull("Should not find form without submit button", form);
    }
    
    @Test
    public void testInvalidContactForm_GetMethod() {
        // Test with a form that uses GET method
        String testPage = "file://" + new File("test_contact_get_method.html").getAbsolutePath();
        WebElement form = detector.findContactForm(testPage, driver);
        
        assertNull("Should not find form with GET method", form);
    }
    
    @Test
    public void testHiddenInputsIgnored() {
        // Test that hidden inputs are ignored
        String testPage = "file://" + new File("test_contact_hidden_inputs.html").getAbsolutePath();
        WebElement form = detector.findContactForm(testPage, driver);
        
        assertNotNull("Should find form when hidden inputs are ignored", form);
    }
    
    @Test
    public void testCaseInsensitive() {
        // Test that attribute values are case-insensitive
        String testPage = "file://" + new File("test_contact_uppercase.html").getAbsolutePath();
        WebElement form = detector.findContactForm(testPage, driver);
        
        assertNotNull("Should find form with uppercase attribute values", form);
    }
}