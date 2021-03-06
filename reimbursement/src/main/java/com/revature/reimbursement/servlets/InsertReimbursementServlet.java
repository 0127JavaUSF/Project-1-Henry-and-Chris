package com.revature.reimbursement.servlets;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.Reimbursement;
import com.revature.reimbursement.User;
import com.revature.reimbursement.daos.ReimbursementDAO;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.exceptions.InvalidUserException;

/**
 * Servlet implementation class InsertReimbursementServlet
 */
public class InsertReimbursementServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InsertReimbursementServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		//avoid CORS errors
		resp.addHeader("Access-Control-Allow-Headers", "authorization");
		resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
		resp.addHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE");
		resp.addHeader("Access-Control-Allow-Origin", "http://localhost:4200");
		
		super.service(req, resp);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        //get post parameters
        String amount = request.getParameter("amount");
    	String description = request.getParameter("description");
    	String hasReceipt = request.getParameter("hasReceipt"); //whether the user has a receipt
        String typeId = request.getParameter("typeId");
        
    	boolean hasReceipt_ = (hasReceipt != null && hasReceipt.isEmpty() == false) ? true : false;

        insertReimbursementDAO(amount, description, hasReceipt_, typeId, request, response);
	}
	
	public static void insertReimbursementDAO(String amount, String description, boolean hasReceipt, String typeId, HttpServletRequest request, HttpServletResponse response) {
		
        //get user from session
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if(user == null) { //if not found
        	
        	response.setStatus(ConnectionUtil.STATUS_FORBIDDEN);
        	return;
        }
        
        ReimbursementDAO reimbDAO = new ReimbursementDAO();
        try {
        	        	
        	Reimbursement reimb = reimbDAO.insertReimbursement(new BigDecimal(amount), description, hasReceipt, user.getId(), Integer.parseInt(typeId));
                                                
            response.setStatus(ConnectionUtil.STATUS_SUCCESS);
            response.setContentType("application/json");

            //do not send primary key to client. if possible, primary keys should not be exposed
            int primaryKey = reimb.getAuthorId();
            reimb.setAuthorId(0);
                        
            //marshalling
        	ObjectMapper om = new ObjectMapper();
        	om.writeValue(response.getWriter(), reimb);        	
        }
        catch (ConnectionException e) {
            response.setStatus(ConnectionUtil.STATUS_UNAVAILABLE);            
        }
        catch (InvalidUserException e2) {
            response.setStatus(ConnectionUtil.STATUS_UNAUTHORIZED); //userId is invalid. should not happen since userId is taken from session 
        }
        catch (SQLException e3) {
            response.setStatus(ConnectionUtil.STATUS_SERVER_ERROR);
        }        
        catch (Exception e) {
        	response.setStatus(ConnectionUtil.STATUS_SERVER_ERROR);
		} 
	}
}
