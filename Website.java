package com.hackerrank.selenium.db;

/**
 * Model class representing a website record from the database
 */
public class Website {
    private int id;
    private String path;
    private String url;
    private String name;
    private String description;
    
    // Default constructor
    public Website() {
    }
    
    // Constructor with parameters
    public Website(int id, String path, String url) {
        this.id = id;
        this.path = path;
        this.url = url;
    }
    
    // Constructor with all parameters
    public Website(int id, String path, String url, String name, String description) {
        this.id = id;
        this.path = path;
        this.url = url;
        this.name = name;
        this.description = description;
    }
    
    // Getters and Setters
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    @Override
    public String toString() {
        return "Website{" +
                "id=" + id +
                ", path='" + path + '\'' +
                ", url='" + url + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Website website = (Website) o;
        
        if (id != website.id) return false;
        if (path != null ? !path.equals(website.path) : website.path != null) return false;
        if (url != null ? !url.equals(website.url) : website.url != null) return false;
        if (name != null ? !name.equals(website.name) : website.name != null) return false;
        return description != null ? description.equals(website.description) : website.description == null;
    }
    
    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (path != null ? path.hashCode() : 0);
        result = 31 * result + (url != null ? url.hashCode() : 0);
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }
}