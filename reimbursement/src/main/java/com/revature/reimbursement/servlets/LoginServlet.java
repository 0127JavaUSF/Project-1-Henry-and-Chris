package com.revature.reimbursement.servlets;

import com.revature.reimbursement.User;
import java.sql.SQLException;
import com.revature.reimbursement.exceptions.InvalidLoginException;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.daos.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServlet;

public class LoginServlet extends HttpServlet
{
	@Override
	public void init() throws ServletException {
		
		//this is required or jdbc will not find driver!
		//only need to call once in one servlet (set ... <load-on-startup>1</load-on-startup>)
		try {
			Class.forName("org.postgresql.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    	//TESTING UserDAO
    	
    	UserDAO userDAO = new UserDAO();
        User user;
		try {
			user = userDAO.logIn("chris", "collins");

	    	response.getWriter().write("Success");
	    	return;
		} catch (ConnectionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvalidLoginException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	response.getWriter().write("failed");
    }
    
	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    	//unmarshalling. creating java from JSON
//    	ObjectMapper om = new ObjectMapper();
//    	om.readValue(request.getReader(), User.class);
    	   	
    	String username = request.getParameter("username");
        String password = request.getParameter("password");
        UserDAO userDAO = new UserDAO();
        try {
            User user = userDAO.logIn(username, password);
            
            //request.setAttribute("user", user); //example of storing in request object
            
                        
            response.setStatus(ConnectionUtil.STATUS_SUCCESS);
            response.setContentType("application/json");

            //marshalling
        	ObjectMapper om = new ObjectMapper();
        	om.writeValue(response.getWriter(), user);
        }
        catch (ConnectionException e) {
            response.setStatus(ConnectionUtil.STATUS_UNAVAILABLE);
        }
        catch (InvalidLoginException e2) {
            response.setStatus(ConnectionUtil.STATUS_UNAUTHORIZED);
        }
        catch (SQLException e3) {
            response.setStatus(ConnectionUtil.STATUS_SERVER_ERROR);
        }
    }
}