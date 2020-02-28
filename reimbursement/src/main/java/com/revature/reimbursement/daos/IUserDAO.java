package com.revature.reimbursement.daos;

import java.sql.SQLException;

import com.revature.reimbursement.User;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.exceptions.InvalidLoginException;
import com.revature.reimbursement.exceptions.InvalidUserException;

public interface IUserDAO
{
    User getUser(int userId) throws ConnectionException, InvalidUserException, SQLException;
    
    User logIn(String username, String password) throws ConnectionException, InvalidLoginException, SQLException;
    
    void hashDatabasePasswords(int id) throws ConnectionException, SQLException;
}