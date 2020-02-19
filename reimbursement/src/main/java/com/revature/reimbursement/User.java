package com.revature.reimbursement;

public class User
{
    public static final int ROLE_EMPLOYEE = 1;
    public static final int ROLE_FINANCE_MANAGER = 2;
    
    private int id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private int roleId;
    
    public void init(int id, String username, String firstName, String lastName, String email, int roleId) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roleId = roleId;
    }
    
    public int getId() {
        return this.id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public String getUsername() {
        return this.username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFirstName() {
        return this.firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return this.lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return this.email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public int getRoleId() {
        return this.roleId;
    }
    
    public String getRoleAsString() {
        switch (this.roleId) {
            case 1: {
                return "Employee";
            }
            case 2: {
                return "Finance Manager";
            }
            default: {
                return "Error";
            }
        }
    }
    
    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }
}