package com.revature.reimbursement.daos;

import com.revature.reimbursement.exceptions.InvalidLoginException;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.Connection;
import java.sql.SQLException;
import com.revature.reimbursement.exceptions.InvalidUserException;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.User;

public class UserDAO implements IUserDAO
{
    @Override
    public User getUser(int userId) throws ConnectionException, InvalidUserException, SQLException {
                
    	try(Connection connection = ConnectionUtil.getConnection()) {
	        if (connection == null) {
	            throw new ConnectionException();
	        }

	        String sql = "SELECT * FROM ers_users WHERE ers_user_id = ?;";
	        
	        PreparedStatement prepared = connection.prepareStatement(sql);
	        prepared.setInt(1, userId);
	        
	        ResultSet result = prepared.executeQuery();
	        if (result.next()) {
	            
	        	User user = new User();
	            setUserFromResultSet(user, result);
	            
	            return user;
	        }
	        throw new InvalidUserException();
    	}
        catch (SQLException e) {
            throw new SQLException();
        }
    }
    
    @Override
    public User logIn(String username, String password) throws ConnectionException, InvalidLoginException, SQLException {
        
    	try(Connection connection = ConnectionUtil.getConnection()) {
            if (connection == null) {
                throw new ConnectionException();
            }
            
            String sql = "SELECT * FROM ers_users WHERE ers_username = ? AND ers_password = ?;";
            
            PreparedStatement prepared = connection.prepareStatement(sql);
            prepared.setString(1, username);
            prepared.setString(2, password);
            
            ResultSet result = prepared.executeQuery();
            if (result.next()) {
            	
                User user = new User();
                setUserFromResultSet(user, result);
                
                return user;
            }
            throw new InvalidLoginException();
        }
        catch (SQLException e) {
            throw new SQLException();
        }
    }
    
    private void setUserFromResultSet(User user, ResultSet result) throws SQLException {
        try {
            user.init(result.getInt("ers_user_id"), result.getString("ers_username"), result.getString("user_first_name"), result.getString("user_last_name"), result.getString("user_email"), result.getInt("user_role_id"));
        }
        catch (SQLException e) {
            throw e;
        }
    }
}