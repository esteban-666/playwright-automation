package com.hackerrank.selenium.db;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.util.List;

import static org.junit.Assert.*;

public class DatabaseTest {
    
    private Database database;
    private Connection testConnection;
    
    @Before
    public void setUp() throws Exception {
        // Create an in-memory SQLite database for testing
        Class.forName("org.sqlite.JDBC");
        testConnection = DriverManager.getConnection("jdbc:sqlite::memory:");
        
        // Create test table
        Statement stmt = testConnection.createStatement();
        stmt.execute("CREATE TABLE website (" +
                     "id INTEGER PRIMARY KEY, " +
                     "path TEXT NOT NULL, " +
                     "url TEXT NOT NULL, " +
                     "name TEXT, " +
                     "description TEXT)");
        
        // Insert test data
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(1, '/contact', 'http://example.com/contact', 'Contact Page')");
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(2, '/support', 'http://example.com/support', 'Support Page')");
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(3, '/feedback', 'http://example.com/feedback', 'Feedback Page')");
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(4, '/contact-us-form', 'http://example.com/contact-us-form', 'Long Contact Path')");
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(5, '/about', 'http://example.com/about', 'About Page')");
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(6, '/home', 'http://example.com/home', 'Home Page')");
        
        stmt.close();
        
        // Initialize Database with in-memory connection
        database = new Database(":memory:");
    }
    
    @After
    public void tearDown() throws Exception {
        if (database != null) {
            database.close();
        }
        if (testConnection != null) {
            testConnection.close();
        }
    }
    
    @Test
    public void testFetchContactPages_ContactPath() {
        List<Website> contactPages = database.fetchContactPages();
        
        // Should find pages with "contact" in path and length < 12
        boolean foundContact = false;
        for (Website page : contactPages) {
            if (page.getPath().equals("/contact")) {
                foundContact = true;
                assertEquals("Path should be /contact", "/contact", page.getPath());
                assertTrue("Path length should be < 12", page.getPath().length() < 12);
            }
        }
        assertTrue("Should find /contact page", foundContact);
    }
    
    @Test
    public void testFetchContactPages_SupportPath() {
        List<Website> contactPages = database.fetchContactPages();
        
        // Should find pages with "support" in path and length < 12
        boolean foundSupport = false;
        for (Website page : contactPages) {
            if (page.getPath().equals("/support")) {
                foundSupport = true;
                assertEquals("Path should be /support", "/support", page.getPath());
                assertTrue("Path length should be < 12", page.getPath().length() < 12);
            }
        }
        assertTrue("Should find /support page", foundSupport);
    }
    
    @Test
    public void testFetchContactPages_FeedbackPath() {
        List<Website> contactPages = database.fetchContactPages();
        
        // Should find pages with "feedback" in path and length < 12
        boolean foundFeedback = false;
        for (Website page : contactPages) {
            if (page.getPath().equals("/feedback")) {
                foundFeedback = true;
                assertEquals("Path should be /feedback", "/feedback", page.getPath());
                assertTrue("Path length should be < 12", page.getPath().length() < 12);
            }
        }
        assertTrue("Should find /feedback page", foundFeedback);
    }
    
    @Test
    public void testFetchContactPages_PathTooLong() {
        List<Website> contactPages = database.fetchContactPages();
        
        // Should NOT find pages with contact-related words but path length >= 12
        boolean foundLongPath = false;
        for (Website page : contactPages) {
            if (page.getPath().equals("/contact-us-form")) {
                foundLongPath = true;
            }
        }
        assertFalse("Should NOT find /contact-us-form (length >= 12)", foundLongPath);
    }
    
    @Test
    public void testFetchContactPages_NonContactPages() {
        List<Website> contactPages = database.fetchContactPages();
        
        // Should NOT find pages without contact-related words
        boolean foundAbout = false;
        boolean foundHome = false;
        for (Website page : contactPages) {
            if (page.getPath().equals("/about")) {
                foundAbout = true;
            }
            if (page.getPath().equals("/home")) {
                foundHome = true;
            }
        }
        assertFalse("Should NOT find /about page", foundAbout);
        assertFalse("Should NOT find /home page", foundHome);
    }
    
    @Test
    public void testFetchContactPages_CaseInsensitive() throws Exception {
        // Add test data with uppercase
        Statement stmt = testConnection.createStatement();
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(7, '/CONTACT', 'http://example.com/CONTACT', 'Upper Contact')");
        stmt.execute("INSERT INTO website (id, path, url, name) VALUES " +
                     "(8, '/Support', 'http://example.com/Support', 'Mixed Support')");
        stmt.close();
        
        List<Website> contactPages = database.fetchContactPages();
        
        // Should find pages regardless of case
        int contactRelatedCount = 0;
        for (Website page : contactPages) {
            String lowerPath = page.getPath().toLowerCase();
            if ((lowerPath.contains("contact") || lowerPath.contains("support") || 
                 lowerPath.contains("feedback")) && page.getPath().length() < 12) {
                contactRelatedCount++;
            }
        }
        
        assertTrue("Should find contact-related pages regardless of case", contactRelatedCount >= 3);
    }
}