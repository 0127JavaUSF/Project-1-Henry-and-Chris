package com.revature.reimbursement.daos;

import com.revature.reimbursement.exceptions.InvalidReimbursementException;
import com.revature.reimbursement.exceptions.InvalidUserException;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.URL;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.LinkedList;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.Reimbursement;
import java.util.List;

public class ReimbursementDAO implements IReimbursementDAO
{
    @Override
    public List<Reimbursement> getReimbursements(int userId) throws ConnectionException, SQLException {
    	
        try(Connection connection = ConnectionUtil.getConnection()) {
        	
            if (connection == null) {
                throw new ConnectionException();
            }
            
            String sql = "SELECT * FROM ers_reimbursement WHERE reimb_author = ?;";
            
            PreparedStatement prepared = connection.prepareStatement(sql);
            prepared.setInt(1, userId);
            
            ResultSet result = prepared.executeQuery();
            
            List<Reimbursement> reimbursements = new LinkedList<Reimbursement>();
            while (result.next()) {
            	
                Reimbursement reimburse = new Reimbursement();
                setReimbursementFromResultSet(reimburse, result);
                
                reimbursements.add(reimburse);
            }
            return reimbursements;
        }
        catch (SQLException e) {
            throw new SQLException();
        }
    }
    
    @Override
    public List<Reimbursement> getAllReimbursements() throws ConnectionException, SQLException {
        
    	try(Connection connection = ConnectionUtil.getConnection()) {
            if (connection == null) {
                throw new ConnectionException();
            }

            //get all reimbursements with the author name and resolver name
            //this adds 2 extra columns to the result set (author and resolver) and pulls the names from ers_users
            String sql = "SELECT r.*, concat(u1.user_first_name, ' ', u1.user_last_name) AS author, concat(u2.user_first_name, ' ', u2.user_last_name) AS resolver FROM ers_reimbursement AS r LEFT JOIN ers_users AS u1 ON r.reimb_author = u1.ers_user_id LEFT JOIN ers_users AS u2 ON r.reimb_resolver = u2.ers_user_id;";
            
            PreparedStatement prepared = connection.prepareStatement(sql);
            ResultSet result = prepared.executeQuery();
            
            List<Reimbursement> reimbursements = new LinkedList<Reimbursement>();          
            while (result.next()) {
            	
                Reimbursement reimburse = new Reimbursement();
                setReimbursementFromResultSet(reimburse, result);
                
                reimburse.setAuthorString(result.getString("author"));
                reimburse.setResolverString(result.getString("resolver"));
                
                //do not send primary keys to client
                reimburse.setAuthorId(0);
                reimburse.setResolverId(0);
                
                reimbursements.add(reimburse);
            }
            return reimbursements;
        }
        catch (SQLException e) {
            throw new SQLException();
        }
    }
    
    @Override
    public Reimbursement insertReimbursement(BigDecimal amount, String description, boolean hasReceipt, int authorId, int typeId) throws ConnectionException, InvalidUserException, SQLException {

    	Connection connection = null;
        try {
        	
        	connection = ConnectionUtil.getConnection();     	
            if (connection == null) {
                throw new ConnectionException();
            }
            
            connection.setAutoCommit(false);
            
            String sql = "INSERT INTO ers_reimbursement (reimb_amount, reimb_description, reimb_author, reimb_type_id) VALUES (?, ?, ?, ?) RETURNING *;";
            
            PreparedStatement prepared = connection.prepareStatement(sql);
            prepared.setBigDecimal(1, amount);
            prepared.setString(2, description);
            prepared.setInt(3, authorId);
            prepared.setInt(4, typeId);
            
            ResultSet result = prepared.executeQuery();
            if (result.next()) {
            	
                Reimbursement reimburse = new Reimbursement();
                setReimbursementFromResultSet(reimburse, result);
                
                if(hasReceipt) {
                	
                	int id = reimburse.getId();
                	
                	//get presigned url from AWS
                	String presignedURL = "";
                	
                	reimburse.setPresignedURL(presignedURL);
                }
                
//                if(receiptFile == null)
//                {
                    connection.commit();
                    return reimburse;
//                }
//                
//                int id = reimburse.getId();
//                String bucketName = System.getenv("AWS_BUCKET_NAME");
//                // creates s3 object
//                final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
//                s3.putObject(bucketName, Integer.toString(id) , receiptFile);
//                URL recieptUrl = s3.getUrl(bucketName, Integer.toString(id));
//                
//                String sql2 = "UPDATE ers_reimbursement "
//                		+ "SET reimb_reciept = ? "
//                		+ "WHERE reimb_id = ?;";
//                
//                PreparedStatement prepared2 = connection.prepareStatement(sql2);
//                prepared2.setString(1, recieptUrl.toString());
//                prepared2.setInt(2, id);
//                
//                int result2 = prepared2.executeUpdate();
//                if (result2 == 1)
//                {
//                	connection.commit();
//                	//sets the url for the reimburse object to retrieve the image
//                	reimburse.setReceipt(recieptUrl.toString());
//                	
//                	return reimburse;
//                }
//                else {
//                	if(connection != null) {
//                		connection.rollback();
//                	}
//                    throw new SQLException();
//                }
            }
            
            throw new InvalidUserException();
        }
        catch (SQLException e) {
        	if(connection != null) {
        		connection.rollback();
        	}
            throw new SQLException();
        }
    }
    
    @Override
    public Reimbursement resolve(int reimbursementId, int resolverUserId, int statusId) throws ConnectionException, InvalidReimbursementException, SQLException {

    	Connection connection = null;
    	try {
    		connection = ConnectionUtil.getConnection();
            if (connection == null) {
                throw new ConnectionException();
            }
            connection.setAutoCommit(false);
            
            String sql = "UPDATE ers_reimbursement SET reimb_resolver = ?, reimb_status_id = ?, reimb_resolved = CURRENT_TIMESTAMP WHERE reimb_id = ? RETURNING 1";
            
            PreparedStatement prepared = connection.prepareStatement(sql);
            prepared.setInt(1, resolverUserId);
            prepared.setInt(2, statusId);
            prepared.setInt(3, reimbursementId);
            
            ResultSet result = prepared.executeQuery();
            if (!result.next()) {
            	connection.rollback();
                throw new InvalidReimbursementException();
            }
            
            sql = "SELECT r.*, concat(u1.user_first_name, ' ', u1.user_last_name) AS author, concat(u2.user_first_name, ' ', u2.user_last_name) AS resolver FROM ers_reimbursement AS r LEFT JOIN ers_users AS u1 ON r.reimb_author = u1.ers_user_id LEFT JOIN ers_users AS u2 ON r.reimb_resolver = u2.ers_user_id WHERE r.reimb_id = ?;";

            prepared = connection.prepareStatement(sql);
            prepared.setInt(1, reimbursementId);
            
            result = prepared.executeQuery();
            if (result.next()) {
            	
                Reimbursement reimburse = new Reimbursement();
                setReimbursementFromResultSet(reimburse, result);
                
                reimburse.setAuthorString(result.getString("author"));
                reimburse.setResolverString(result.getString("resolver"));
                
                //do not send primary keys to client
                reimburse.setAuthorId(0);
                reimburse.setResolverId(0);
                
                connection.commit();
                
                return reimburse;
            }    

            connection.rollback();
            throw new InvalidReimbursementException();
    	}
        catch (SQLException e) {
        	if(connection != null) {
        		connection.rollback();
        	}
            throw new SQLException();
        }
    }
    
    private void setReimbursementFromResultSet(Reimbursement reimburse, ResultSet result) throws SQLException {
        try {
            reimburse.init(result.getInt("reimb_id"), result.getBigDecimal("reimb_amount"), result.getTimestamp("reimb_submitted"), result.getTimestamp("reimb_resolved"), result.getString("reimb_description"), result.getString("reimb_reciept"), result.getInt("reimb_author"), result.getInt("reimb_resolver"), result.getInt("reimb_status_id"), result.getInt("reimb_type_id"));
        }
        catch (SQLException e) {
            throw e;
        }
    }
}