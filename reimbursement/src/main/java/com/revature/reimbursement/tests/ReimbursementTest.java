package com.revature.reimbursement.tests;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.math.BigDecimal;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.revature.reimbursement.Reimbursement;
import com.revature.reimbursement.daos.ReimbursementDAO;

public class ReimbursementTest {
	
	ReimbursementDAO reimbDAO = new ReimbursementDAO();

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
	public void getReimbursementsTest() {
		
		try {
			//get reimbursements for user henry
			assertNotNull(reimbDAO.getReimbursements(2));
			
			assertEquals("get reimbursements for user not in database", 0, reimbDAO.getReimbursements(0).size());

		} catch (Exception e ) {
			
		}
	}
	
	@Test
	public void insertAndDeleteReimbursementTest() {
				
		try {
			//test inserting a reimbursement into the database
			Reimbursement inserted = reimbDAO.insertReimbursement(new BigDecimal(100.0), "Testing ticket insertion", false, 2, Reimbursement.TYPE_TRAVEL);
			assertNotNull(inserted);
			
			assertEquals("delete newly created reimbursement", true, reimbDAO.deleteReimbursement(inserted.getId()));

		} catch (Exception e ) {
			
		}
	}
}
