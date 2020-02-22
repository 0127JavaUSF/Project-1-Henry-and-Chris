package com.revature.reimbursement.servlets;

import com.revature.reimbursement.User;
import java.sql.SQLException;
import com.revature.reimbursement.exceptions.InvalidLoginException;

import at.favre.lib.crypto.bcrypt.BCrypt;
import at.favre.lib.crypto.bcrypt.BCrypt.Hasher;

import com.revature.reimbursement.exceptions.ConnectionException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.daos.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.Provider.Service;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		
		//route to doPost for testing. this servlet only accepts POST anyway
		
		//avoid CORS errors
		resp.addHeader("Access-Control-Allow-Headers", "authorization");
		resp.addHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE");
		resp.addHeader("Access-Control-Allow-Origin", "http://localhost:4200");
		
		doPost(req, resp);
	}
    
	@Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
    	//unmarshalling example. creating java from JSON
//    	ObjectMapper om = new ObjectMapper();
//    	om.readValue(request.getReader(), User.class);		
	    	   	
    	String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        UserDAO userDAO = new UserDAO();
        try {
            User user = userDAO.logIn(username, password);
            
            //binds user to session
            HttpSession session = request.getSession();
            session.setAttribute("user", user);
                                    
            response.setStatus(ConnectionUtil.STATUS_SUCCESS);
            response.setContentType("application/json");

            //do not send primary key to client. if possible, primary keys should not be exposed
            int primaryKey = user.getId();
            user.setId(0);
            
            //marshalling
        	ObjectMapper om = new ObjectMapper();
        	om.writeValue(response.getWriter(), user);
        	
        	user.setId(primaryKey); //restore primary key (so session user id is correct)
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