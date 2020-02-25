package com.revature.reimbursement.servlets;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.apache.tomcat.util.http.fileupload.servlet.ServletFileUpload;

import com.revature.reimbursement.ConnectionUtil;

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

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
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
	        
	    String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString(); // MSIE fix.
	    InputStream receipt = filePart.getInputStream();
	    Files.copy(receipt, Paths.get(fileName));
	    File file = new File(fileName);
        
	    //get post parameters
        String amount = "1.25";
    	String description = "testing description";
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
        
        InsertReimbursementServlet.insertReimbursementDAO(file, amount, description, typeId, request, response);
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