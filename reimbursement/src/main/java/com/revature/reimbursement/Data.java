package com.revature.reimbursement;

public class Data
{
    private static final Data data = new Data();
    private User user = null;
        
    private Data() {
        super();
    }
    
    public User getUser() {
        return this.user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public static Data getData() {
        return Data.data;
    }
}