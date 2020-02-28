package com.revature.reimbursement.daos;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.User;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.exceptions.InvalidLoginException;
import com.revature.reimbursement.exceptions.InvalidUserException;

import at.favre.lib.crypto.bcrypt.BCrypt;
import at.favre.lib.crypto.bcrypt.BCrypt.Hasher;
import at.favre.lib.crypto.bcrypt.BCrypt.Verifyer;

public class UserDAO implements IUserDAO
{
	/** get the user from the user id **/
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
    
    /** get the user from the login info **/
    @Override
    public User logIn(String username, String password) throws ConnectionException, InvalidLoginException, SQLException {
        
    	try(Connection connection = ConnectionUtil.getConnection()) {
            if (connection == null) {
                throw new ConnectionException();
            }
    		Verifyer verifyer = BCrypt.verifyer();
    						
            String sql = "SELECT * FROM ers_users WHERE ers_username = ?;";
            
            PreparedStatement prepared = connection.prepareStatement(sql);
            prepared.setString(1, username);
            
            ResultSet result = prepared.executeQuery();
            if (result.next()) {
            	if(verifyer.verify(password.toCharArray(), result.getString("ers_password").toCharArray()).verified)
            	{
            		User user = new User();
                    setUserFromResultSet(user, result);
                    
                    return user;
            	}
            	else
            	{
            		throw new InvalidLoginException();
            	}
            	
            }
            throw new InvalidLoginException(); //username is not in database exception
        }
        catch (SQLException e) {
            throw new SQLException();
        }
    }
    
    /** set the User from the ResultSet **/
    private void setUserFromResultSet(User user, ResultSet result) throws SQLException {
        try {
            user.init(result.getInt("ers_user_id"), result.getString("ers_username"), result.getString("user_first_name"), result.getString("user_last_name"), result.getString("user_email"), result.getInt("user_role_id"));
        }
        catch (SQLException e) {
            throw e;
        }
    }
    
    /** hashes the User's password assuming it is in the database unhashed **/
    public void hashDatabasePasswords(int id) throws ConnectionException, SQLException
    {
    	//one way hashing. hashToString(4...) means 2 to the power 4 (function runs 16 times), known as "key stretching". hash value contains original password, salt and hash algorithm
    	//the "salt" are random bytes. if 2 passwords are identical, the random salt results in different hash values (to prevent rainbow table attacks)

    	//create the hasher
    	Hasher hash = BCrypt.withDefaults();
    	try(Connection connection = ConnectionUtil.getConnection()) {
            if (connection == null) {
                throw new ConnectionException();
            }
            connection.setAutoCommit(false);            
            String sql = "SELECT ers_password FROM ers_users WHERE ers_user_id = ?;";           
            PreparedStatement prepared = connection.prepareStatement(sql);
            prepared.setInt(1, id);
            ResultSet result = prepared.executeQuery();
            if (result.next()) {                
            	char[] password = result.getString("ers_password").toCharArray();
                String newPass = hash.hashToString(4,password);  
                String sql2 = "UPDATE ers_users "
                		+ "set ers_password = ? "
                		+ "where ers_user_id = ?";
                PreparedStatement statement2 = connection.prepareStatement(sql2);				
                statement2.setString(1, newPass);
				statement2.setInt(2, id);				
				statement2.executeUpdate();
				System.out.println("Hashing id " + id + " password to " + newPass);
				connection.commit();
            }
        }
        catch (SQLException e) {
        	e.printStackTrace();
            throw new SQLException();
        }
    }
}