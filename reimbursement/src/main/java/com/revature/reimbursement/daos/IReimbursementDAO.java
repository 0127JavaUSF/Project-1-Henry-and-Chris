package com.revature.reimbursement.daos;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

import com.revature.reimbursement.Reimbursement;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.exceptions.InvalidReimbursementException;
import com.revature.reimbursement.exceptions.InvalidUserException;

public interface IReimbursementDAO
{
    List<Reimbursement> getReimbursements(int userId) throws ConnectionException, SQLException;
        
    List<Reimbursement> getAllReimbursements() throws ConnectionException, SQLException;
    
    Reimbursement insertReimbursement(BigDecimal amount, String description, boolean hasReceipt, int authorId, int typeId) throws ConnectionException, InvalidUserException, SQLException;
    
    boolean deleteReimbursement(int id) throws ConnectionException, InvalidReimbursementException, SQLException;

    Reimbursement resolve(int reimbursementId, int resolverUserId, int statusId) throws ConnectionException, InvalidReimbursementException, SQLException;
}