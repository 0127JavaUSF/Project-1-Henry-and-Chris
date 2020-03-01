package com.revature.reimbursement.servlets;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.User;

/**
 * Servlet implementation class GetUserServlet
 */
public class GetUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetUserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
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
				
		//avoid CORS errors
		resp.addHeader("Access-Control-Allow-Headers", "authorization");
		resp.addHeader("Access-Control-Allow-Headers", "Content-Type");
		resp.addHeader("Access-Control-Allow-Methods", "GET POST PUT DELETE");
		resp.addHeader("Access-Control-Allow-Origin", "http://localhost:4200");

		super.service(req, resp);
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        //get user from session
        HttpSession session = request.getSession(false); //false means do not create a new session
        if(session == null || session.getAttribute("user") == null) { //if not found
        	
        	response.setStatus(ConnectionUtil.STATUS_SUCCESS);
            response.setContentType("application/json");

            //return empty JSON (client code expects a response object)
            response.getWriter().write("{}");
        	return;
        }
        
    	User user = (User)session.getAttribute("user");
                                               
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
}
