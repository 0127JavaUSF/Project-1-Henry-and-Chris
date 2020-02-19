package com.revature.reimbursement.daos;

import com.revature.reimbursement.exceptions.InvalidReimbursementException;
import java.math.BigDecimal;
import java.sql.SQLException;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.Reimbursement;
import java.util.List;

public interface IReimbursementDAO
{
    List<Reimbursement> getReimbursements(int userId) throws ConnectionException, SQLException;
    
    List<Reimbursement> getReimbursementsByStatus(int statusId) throws ConnectionException, SQLException;
    
    List<Reimbursement> getAllReimbursements() throws ConnectionException, SQLException;
    
    Reimbursement insertReimbursement(BigDecimal amount, String description, int authorId, int typeId) throws ConnectionException, SQLException;
    
    void resolve(int reimbursementId, int resolverUserId, int statusId) throws ConnectionException, InvalidReimbursementException, SQLException;
}