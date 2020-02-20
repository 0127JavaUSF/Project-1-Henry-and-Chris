package com.revature.reimbursement.daos;


import java.util.List;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ListObjectsV2Result;
import com.amazonaws.services.s3.model.S3ObjectSummary;

public class Test {

	public static void main(String[] args) {
		
		
		
		BasicAWSCredentials awsCreds = new BasicAWSCredentials(System.getenv("AWS_ACCESS_KEY_ID"),System.getenv("AWS_SECRET_ACCESS_KEY"));
		final AmazonS3 s3 = AmazonS3ClientBuilder.standard().withRegion(Regions.US_EAST_1).build();
		
		ListObjectsV2Result result = s3.listObjectsV2("my-project-1-bucket");
		List<S3ObjectSummary> objects = result.getObjectSummaries();
		System.out.println(result);
		for (S3ObjectSummary os : objects) {
		    System.out.println("* " + os.getKey());
		}
	}

}

