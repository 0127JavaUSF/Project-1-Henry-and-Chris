package com.revature.reimbursement.servlets;

import java.io.IOException;
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

/**
 * Servlet implementation class GetAllReimbursementsServlet
 */
public class ResolveReimbursementServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ResolveReimbursementServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
				
		//avoid CORS errors
		resp.addHeader("Access-Control-Allow-Headers", "authorization");
		resp.addHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE");
		resp.addHeader("Access-Control-Allow-Origin", "http://localhost:4200");

		super.service(req, resp);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
        //get user from session
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if(user == null || user.getRoleId() != User.ROLE_FINANCE_MANAGER) { //if not found or not manager
        	
        	response.setStatus(ConnectionUtil.STATUS_FORBIDDEN);
        	return;
        }
        
    	String reimbId = request.getParameter("reimbId");
        String statusId = request.getParameter("statusId");
        
        ReimbursementDAO reimbDAO = new ReimbursementDAO();
        try {
        	//resolve the reimbursement
        	Reimbursement reimb = reimbDAO.resolve(Integer.parseInt(reimbId), user.getId(), Integer.parseInt(statusId));
                                                
            response.setStatus(ConnectionUtil.STATUS_SUCCESS);
            response.setContentType("application/json");
            
            //marshalling
        	ObjectMapper om = new ObjectMapper();
        	om.writeValue(response.getWriter(), reimb);
        }
        catch (ConnectionException e) {
            response.setStatus(ConnectionUtil.STATUS_UNAVAILABLE);            
        }
        catch (SQLException e3) {
            response.setStatus(ConnectionUtil.STATUS_SERVER_ERROR);
        }        
        catch (Exception e) {
        	response.setStatus(ConnectionUtil.STATUS_SERVER_ERROR);
		}
	}

}
