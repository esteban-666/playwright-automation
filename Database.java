package com.hackerrank.selenium.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Database {
    
    private Connection connection;
    private static final String DB_URL = "jdbc:sqlite:website.db"; // Adjust path as needed
    
    /**
     * Constructor - initializes database connection
     */
    public Database() {
        try {
            // Load SQLite JDBC driver
            Class.forName("org.sqlite.JDBC");
            // Connect to database
            this.connection = DriverManager.getConnection(DB_URL);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Alternative constructor with custom database path
     */
    public Database(String dbPath) {
        try {
            Class.forName("org.sqlite.JDBC");
            this.connection = DriverManager.getConnection("jdbc:sqlite:" + dbPath);
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Fetches all contact pages from the website table.
     * A page is considered a contact page if:
     * - Path contains "contact" OR "support" OR "feedback" (case-insensitive)
     * - Path length is less than 12 characters
     * 
     * @return List of Website objects that are contact pages
     */
    public List<Website> fetchContactPages() {
        List<Website> contactPages = new ArrayList<>();
        
        try {
            // SQL query to fetch contact pages based on criteria
            String sql = "SELECT * FROM website WHERE " +
                        "(LOWER(path) LIKE '%contact%' OR " +
                        "LOWER(path) LIKE '%support%' OR " +
                        "LOWER(path) LIKE '%feedback%') AND " +
                        "LENGTH(path) < 12";
            
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();
            
            // Process results
            while (resultSet.next()) {
                Website website = new Website();
                
                // Assuming Website model has these fields
                website.setId(resultSet.getInt("id"));
                website.setPath(resultSet.getString("path"));
                website.setUrl(resultSet.getString("url"));
                
                // Add any other fields that might exist in the Website model
                // Check if columns exist before trying to get them
                try {
                    website.setName(resultSet.getString("name"));
                } catch (SQLException e) {
                    // Column might not exist
                }
                
                try {
                    website.setDescription(resultSet.getString("description"));
                } catch (SQLException e) {
                    // Column might not exist
                }
                
                contactPages.add(website);
            }
            
            // Close resources
            resultSet.close();
            statement.close();
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return contactPages;
    }
    
    /**
     * Alternative implementation using more explicit path checking
     */
    public List<Website> fetchContactPagesAlternative() {
        List<Website> contactPages = new ArrayList<>();
        
        try {
            // First, fetch all websites
            String sql = "SELECT * FROM website";
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();
            
            while (resultSet.next()) {
                String path = resultSet.getString("path");
                
                // Check if path meets the criteria
                if (path != null && path.length() < 12) {
                    String lowerPath = path.toLowerCase();
                    if (lowerPath.contains("contact") || 
                        lowerPath.contains("support") || 
                        lowerPath.contains("feedback")) {
                        
                        Website website = new Website();
                        website.setId(resultSet.getInt("id"));
                        website.setPath(path);
                        website.setUrl(resultSet.getString("url"));
                        
                        // Add other fields if they exist
                        try {
                            website.setName(resultSet.getString("name"));
                        } catch (SQLException ignored) {}
                        
                        try {
                            website.setDescription(resultSet.getString("description"));
                        } catch (SQLException ignored) {}
                        
                        contactPages.add(website);
                    }
                }
            }
            
            resultSet.close();
            statement.close();
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return contactPages;
    }
    
    /**
     * Close database connection
     */
    public void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * Get the database connection
     */
    public Connection getConnection() {
        return connection;
    }
}