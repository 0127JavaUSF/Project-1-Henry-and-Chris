package com.revature.reimbursement.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

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
	 * @see HttpServlet#doPut(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
        //get user from session
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if(user == null || user.getRoleId() != User.ROLE_FINANCE_MANAGER) { //if not found or not manager
        	
        	response.setStatus(ConnectionUtil.STATUS_FORBIDDEN);
        	return;
        }

        //getParameter() does not work with PUT request
//    	String reimbId = request.getParameter("reimbId");
//    	String statusId = request.getParameter("statusId");
        
        //only using PUT because it is proper according to REST but honestly PUT is not as user friendly because getting the parameters is more code
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String data = br.readLine(); //this is a string with all the parameters separated by &
        String[] params = data.split("&"); //get each seperate parameter (ie: reimbId=1)
        String reimbId = params[0].substring(params[0].lastIndexOf("=") + 1); //get actual value after = sign
        String statusId = params[1].substring(params[1].lastIndexOf("=") + 1);
        
        //testing
//        Logger logger = Logger.getRootLogger();
//        logger.debug("data = " + data);
//        logger.debug("reimbId = " + reimbId);
//        logger.debug("statusId = " + statusId);
        
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
