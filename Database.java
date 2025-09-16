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
    
    // Constructor - initialize database connection
    public Database() {
        try {
            // Load SQLite JDBC driver
            Class.forName("org.sqlite.JDBC");
            // Connect to database (adjust path as needed)
            this.connection = DriverManager.getConnection("jdbc:sqlite:website.db");
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }
    }
    
    public List<Website> fetchContactPages() {
        List<Website> contactPages = new ArrayList<>();
        
        try {
            // SQL query to fetch contact pages based on criteria:
            // - Path contains "contact" OR "support" OR "feedback" (case-insensitive)
            // - Path length is less than 12 characters
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
                
                // Set the fields from the result set
                website.setId(resultSet.getInt("id"));
                website.setPath(resultSet.getString("path"));
                website.setUrl(resultSet.getString("url"));
                
                // Add any other fields that might exist in the Website model
                try {
                    website.setName(resultSet.getString("name"));
                } catch (SQLException e) {
                    // Column might not exist, ignore
                }
                
                try {
                    website.setDescription(resultSet.getString("description"));
                } catch (SQLException e) {
                    // Column might not exist, ignore
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
    
    // Helper method to close database connection
    public void close() {
        try {
            if (connection != null && !connection.isClosed()) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}