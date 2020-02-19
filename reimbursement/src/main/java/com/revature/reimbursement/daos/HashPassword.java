package com.revature.reimbursement.daos;

import java.sql.SQLException;

import com.revature.reimbursement.exceptions.ConnectionException;

public class HashPassword {

	public static void main(String[] args) {
		UserDAO ha = new UserDAO();
		
		try {
			ha.hashDatabasePasswords();
		} catch (ConnectionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
