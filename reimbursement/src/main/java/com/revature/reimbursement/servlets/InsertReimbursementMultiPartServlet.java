package com.revature.reimbursement.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;

import com.revature.reimbursement.ConnectionUtil;
import com.revature.reimbursement.User;

/**
 * Servlet implementation class InsertReimbursementMultiPartServlet
 */
@MultipartConfig
public class InsertReimbursementMultiPartServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public InsertReimbursementMultiPartServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    //note: this is not used. instead an AWS presigned url is used to upload directly to Amazon
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
        //get user from session
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        if(user == null) { //if not found
        	
        	response.setStatus(ConnectionUtil.STATUS_FORBIDDEN);
        	return;
        }
        
        //if not multi part form
        if (!ServletFileUpload.isMultipartContent(request)) {
            
        	response.setStatus(ConnectionUtil.STATUS_CLIENT_ERROR);
            return;
        }
		
	    Part filePart = request.getPart("file"); // Retrieves <input type="file" name="file">  
	    if(filePart == null) {
	    	
	    	//if file missing (receipt image file)
		    response.setStatus(ConnectionUtil.STATUS_CLIENT_ERROR);
		    return;
	    }
	        
	    //get file name
	    String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
	    
	    //copy to File object
	    InputStream receipt = filePart.getInputStream();
	    Files.copy(receipt, Paths.get(fileName), StandardCopyOption.REPLACE_EXISTING);
	    File file = new File(fileName);
        
	    //get post parameters from multi part form
        String amount = "0";
    	String description = "description";
        String typeId = "2";
        for(Part part : request.getParts()) {
        	
        	if( part.getName().equals("amount") ) {
        		amount = getValue(part);
        	}
        	else if( part.getName().equals("description") ) {
        		description = getValue(part);
        	}
        	else if( part.getName().equals("typeId") ) {
        		typeId = getValue(part);
        	}
        }
        
        InsertReimbursementServlet.insertReimbursementDAO(amount, description, true, typeId, request, response);
	}
	
	//returns the post parameter value in the Part
	public static String getValue(Part part) throws IOException {
		
		  BufferedReader reader=new BufferedReader(new InputStreamReader(part.getInputStream(),"UTF-8"));
		  StringBuilder value=new StringBuilder();
		  char[] buffer=new char[1024];
		  for (int length=0; (length=reader.read(buffer)) > 0; ) {
		    value.append(buffer,0,length);
		  }
		  return value.toString();
		}
}