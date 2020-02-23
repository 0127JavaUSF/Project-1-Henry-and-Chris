package com.revature.reimbursement.daos;


import java.io.File;
import java.net.URL;
import java.sql.SQLException;
import java.util.List;


import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.revature.reimbursement.exceptions.ConnectionException;

public class Test {

	public static void main(String[] args) {
		
		
		
		//new BasicAWSCredentials(System.getenv("AWS_ACCESS_KEY_ID"),System.getenv("AWS_SECRET_ACCESS_KEY"));
		String bucketName = System.getenv("AWS_BUCKET_NAME");
		final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
		
//		s3.putObject(bucketName, "8" , new File("C:/picture.png"));
		//s3.putObject(bucketName, "24" , new File("C:\\Users\\chris\\Documents\\lastimage.png"));
		
		ListObjectsV2Result result = s3.listObjectsV2(bucketName);
		List<S3ObjectSummary> objects = result.getObjectSummaries();
		//URL sdf = s3.getUrl("my-project-1-bucket", "3");
		//S3Object asdf = s3.getObject("my-project-1-bucket", "3");
		//System.out.println(sdf);
		//System.out.println(asdf);
		for (S3ObjectSummary os : objects) {
		    System.out.println("* " + os.getKey());
		}
		
		UserDAO user = new UserDAO();
		try {
			user.hashDatabasePasswords(7);
		} catch (ConnectionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}

