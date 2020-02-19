package com.revature.reimbursement;

import java.sql.SQLException;
import java.sql.DriverManager;
import java.sql.Connection;

public class ConnectionUtil
{
    public static final int STATUS_SUCCESS = 200;
    public static final int STATUS_UNAUTHORIZED = 401;
    public static final int STATUS_SERVER_ERROR = 500;
    public static final int STATUS_UNAVAILABLE = 503;
    
    public static Connection getConnection() {
        String url = System.getenv("JDBC_URL_P1");
        String user = System.getenv("JDBC_ROLE");
        String password = System.getenv("JDBC_PASSWORD_P1");
        try {
            return DriverManager.getConnection(url, user, password);
        }
        catch (SQLException e) {
        	e.printStackTrace();
            return null;
        }
    }
}