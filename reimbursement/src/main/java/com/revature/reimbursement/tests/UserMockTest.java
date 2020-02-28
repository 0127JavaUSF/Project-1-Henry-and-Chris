package com.revature.reimbursement.tests;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import com.revature.reimbursement.User;
import com.revature.reimbursement.daos.UserDAO;

@RunWith(MockitoJUnitRunner.class)
public class UserMockTest {

	//this is just an example of how to use Mockito
	//Mockito creates mock objects that are dependencies of what we are testing
	//but our DAOs have no dependencies other than POJOs
	
	private static User henry;
	
	@Mock
	UserDAO userDAO;
	
	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	
		henry = new User();
		henry.init(2, "username", "henry", "s", "hs@email.com", User.ROLE_FINANCE_MANAGER);
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
			when(userDAO.getUser(2)).thenReturn(henry);
				
			assertEquals("get user henry", "username", userDAO.getUser(2).getUsername());
			
			when(userDAO.getUser(0)).thenReturn(null);
			
			assertEquals("bad user", null, userDAO.getUser(0));
		}
		catch(Exception e) {
			
		}
	}
}

