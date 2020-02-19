package com.revature.reimbursement.daos;

import com.revature.reimbursement.exceptions.InvalidLoginException;
import java.sql.SQLException;
import com.revature.reimbursement.exceptions.InvalidUserException;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.User;

public interface IUserDAO
{
    User getUser(int userId) throws ConnectionException, InvalidUserException, SQLException;
    
    User logIn(String username, String password) throws ConnectionException, InvalidLoginException, SQLException;
}