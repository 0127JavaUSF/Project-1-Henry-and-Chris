package com.revature.reimbursement.tests;

import static org.junit.Assert.assertEquals;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.revature.reimbursement.daos.UserDAO;

public class UserTest {
	
	UserDAO userDAO = new UserDAO();

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
				
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {

	}

	@Before
	public void setUp() throws Exception {
	
	}

	@After
	public void tearDown() throws Exception {
	
	}
	
	@Test
	public void getUserTest() {
		
		try {
			assertEquals("get user henry", "henry", userDAO.getUser(2).getUsername());
			
			assertEquals("get user chris", "chris", userDAO.getUser(3).getUsername());

			assertEquals("bad user", null, userDAO.getUser(0));

		} catch (Exception e ) {
			
		}
	}
	
	@Test
	public void loginTest() {
		
		try {
			assertEquals("login elsworth", 4, userDAO.logIn("elsworth", "password").getId());
			
			assertEquals("bad login", null, userDAO.logIn("incorrect_username", "incorrect_password"));

		} catch (Exception e ) {
			
		}
	}
}
