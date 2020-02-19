package com.revature.reimbursement.servlets;

import com.revature.reimbursement.User;
import java.sql.SQLException;
import com.revature.reimbursement.exceptions.InvalidLoginException;
import com.revature.reimbursement.exceptions.ConnectionException;
import com.revature.reimbursement.Data;
import com.revature.reimbursement.daos.UserDAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServlet;

public class LoginServlet extends HttpServlet
{
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.getWriter().write("testing");
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        UserDAO userDAO = new UserDAO();
        try {
            User user = userDAO.logIn(username, password);
            Data.getData().setUser(user);
        }
        catch (ConnectionException e) {
            response.setStatus(503);
        }
        catch (InvalidLoginException e2) {
            response.setStatus(401);
        }
        catch (SQLException e3) {
            response.setStatus(500);
        }
    }
}