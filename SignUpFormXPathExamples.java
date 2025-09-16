import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import java.util.List;

public class SignUpFormXPathExamples {
    
    public static void main(String[] args) {
        WebDriver driver = new ChromeDriver();
        
        // ALTERNATIVE 1: Direct absolute XPath to all inputs within div with id="bucket"
        // This is the most straightforward approach
        List<WebElement> inputs1 = driver.findElements(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input")
        );
        
        // ALTERNATIVE 2: Using descendant axis from the bucket div
        // This gets all input descendants regardless of depth
        List<WebElement> inputs2 = driver.findElements(
            By.xpath("/html/body/div/section/div[@id='bucket']//input")
        );
        
        // ALTERNATIVE 3: Individual absolute XPaths for each input (if you need them separately)
        // First Name input
        WebElement firstNameInput = driver.findElement(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input[1]")
        );
        
        // Last Name input
        WebElement lastNameInput = driver.findElement(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input[2]")
        );
        
        // Email input
        WebElement emailInput = driver.findElement(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input[3]")
        );
        
        // Password input
        WebElement passwordInput = driver.findElement(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input[4]")
        );
        
        // Confirm Password input
        WebElement confirmPasswordInput = driver.findElement(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input[5]")
        );
        
        // ALTERNATIVE 4: Using position() function to get all inputs
        List<WebElement> inputs4 = driver.findElements(
            By.xpath("/html/body/div/section/div[@id='bucket']/input[position()>=1 and position()<=5]")
        );
        
        // ALTERNATIVE 5: Most complete absolute path with all attributes
        List<WebElement> inputs5 = driver.findElements(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@class='layout-column align-items-stretch mx-16' and @id='bucket']/input")
        );
        
        // ALTERNATIVE 6: Using following-sibling from labels
        // This approach navigates from labels to their following input siblings
        List<WebElement> inputs6 = driver.findElements(
            By.xpath("/html/body/div/section/div[@id='bucket']/label/following-sibling::input[1]")
        );
        
        // ALTERNATIVE 7: Absolute XPath with wildcard for intermediate elements
        List<WebElement> inputs7 = driver.findElements(
            By.xpath("/html/body/*/section/div[@id='bucket']/input")
        );
        
        // ALTERNATIVE 8: Using child axis explicitly
        List<WebElement> inputs8 = driver.findElements(
            By.xpath("/html/body/child::div/child::section/child::div[@id='bucket']/child::input")
        );
        
        // ALTERNATIVE 9: Combining multiple conditions
        List<WebElement> inputs9 = driver.findElements(
            By.xpath("/html/body/div[contains(@class,'card')]/section[contains(@class,'card-text')]/div[@id='bucket']/input[@type='text' or @type='password']")
        );
        
        // ALTERNATIVE 10: Using count to verify we got all 5 inputs
        List<WebElement> allInputs = driver.findElements(
            By.xpath("/html/body/div/section/div[@id='bucket']/input")
        );
        
        // Verification
        System.out.println("Total inputs found: " + allInputs.size());
        
        // Print details of each input
        for (int i = 0; i < allInputs.size(); i++) {
            WebElement input = allInputs.get(i);
            System.out.println("Input " + (i + 1) + ":");
            System.out.println("  ID: " + input.getAttribute("id"));
            System.out.println("  Name: " + input.getAttribute("name"));
            System.out.println("  Type: " + input.getAttribute("type"));
            System.out.println("  Placeholder: " + input.getAttribute("placeholder"));
        }
        
        driver.quit();
    }
    
    // Helper method to interact with the inputs
    public static void fillForm(WebDriver driver) {
        // Using the most reliable absolute XPath
        driver.findElement(By.xpath("/html/body/div/section/div[@id='bucket']/input[1]")).sendKeys("John");
        driver.findElement(By.xpath("/html/body/div/section/div[@id='bucket']/input[2]")).sendKeys("Doe");
        driver.findElement(By.xpath("/html/body/div/section/div[@id='bucket']/input[3]")).sendKeys("john.doe@example.com");
        driver.findElement(By.xpath("/html/body/div/section/div[@id='bucket']/input[4]")).sendKeys("SecurePassword123!");
        driver.findElement(By.xpath("/html/body/div/section/div[@id='bucket']/input[5]")).sendKeys("SecurePassword123!");
    }
    
    // Alternative: Using a single XPath to get all inputs and then iterate
    public static void fillFormAlternative(WebDriver driver) {
        List<WebElement> inputs = driver.findElements(
            By.xpath("/html/body/div[@class='card w-30 mx-auto mt-50']/section[@class='card-text']/div[@id='bucket']/input")
        );
        
        String[] values = {"John", "Doe", "john.doe@example.com", "SecurePassword123!", "SecurePassword123!"};
        
        for (int i = 0; i < inputs.size() && i < values.length; i++) {
            inputs.get(i).sendKeys(values[i]);
        }
    }
}