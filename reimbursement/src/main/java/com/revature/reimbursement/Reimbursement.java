package com.revature.reimbursement;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class Reimbursement
{
    public static final int STATUS_PENDING = 1;
    public static final int STATUS_APPROVED = 2;
    public static final int STATUS_DENIED = 3;
    
    public static final int TYPE_LODGING = 1;
    public static final int TYPE_TRAVEL = 2;
    public static final int TYPE_FOOD = 3;
    public static final int TYPE_OTHER = 4;
    
    private int id;
    private BigDecimal amount;
    private Timestamp submitted;
    private String submittedString;
    private Timestamp resolved;
    private String resolvedString;
    private String description;
    private String receipt;
    private String presignedURL; //used by AWS S3 bucket
    private int authorId;
    private String authorString; //first and last name of author
    private int resolverId;
    private String resolverString; //first and last name of resolver
    private int statusId;
    private int typeId;
    
    public void init(int id, BigDecimal amount, Timestamp submitted, Timestamp resolved, String description, String receipt, int authorId, int resolverId, int statusId, int typeId) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.receipt = receipt;
        this.authorId = authorId;
        this.resolverId = resolverId;
        this.statusId = statusId;
        this.typeId = typeId;

        this.setSubmitted(submitted);
        this.setResolved(resolved);
}
    
    public int getId() {
        return this.id;
    }
    
    public void setId(final int id) {
        this.id = id;
    }
    
    public BigDecimal getAmount() {
        return this.amount;
    }
    
    public void setAmount(final BigDecimal amount) {
        this.amount = amount;
    }
    
    public Timestamp getSubmitted() {
        return this.submitted;
    }
    
    public void setSubmitted(final Timestamp submitted) {
        this.submitted = submitted;
        
        if(submitted == null) {
        	this.submittedString = "";
        }
        else {
        	//set the string version in the specified format
        	this.submittedString = new SimpleDateFormat("M/d/yyyy h:mm aa").format(submitted);
        }
    }
    
    public Timestamp getResolved() {
        return this.resolved;
    }
    
    public void setResolved(final Timestamp resolved) {
        this.resolved = resolved;
        
        if(resolved == null) {
        	this.resolvedString = "";
        }
        else {
        	//set the string version in the specified format
        	this.resolvedString = new SimpleDateFormat("M/d/yyyy h:mm aa").format(resolved);
        }
    }
    
    public String getDescription() {
        return this.description;
    }
    
    public void setDescription(final String description) {
        this.description = description;
    }
    
    public String getReceipt() {
        return this.receipt;
    }
    
    public void setReceipt(final String receipt) {
        this.receipt = receipt;
    }
    
    public int getAuthorId() {
        return this.authorId;
    }
    
    public void setAuthorId(final int authorId) {
        this.authorId = authorId;
    }
    
    public int getResolverId() {
        return this.resolverId;
    }
    
    public void setResolverId(final int resolverId) {
        this.resolverId = resolverId;
    }
    
    public int getStatusId() {
        return this.statusId;
    }
    
    //get the status name
    public String getStatusAsString() {
        switch (this.statusId) {
            case 1: {
                return "Pending";
            }
            case 2: {
                return "Approved";
            }
            case 3: {
                return "Denied";
            }
            default: {
                return "Error";
            }
        }
    }
    
    public void setStatusId(final int statusId) {
        this.statusId = statusId;
    }
    
    public int getTypeId() {
        return this.typeId;
    }
    
    //get the type name
    public String getTypeAsString() {
        switch (this.statusId) {
            case 3: {
                return "Food";
            }
            case 1: {
                return "Lodging";
            }
            case 4: {
                return "Other";
            }
            case 2: {
                return "Travel";
            }
            default: {
                return "Error";
            }
        }
    }
    
    public void setTypeId(final int typeId) {
        this.typeId = typeId;
    }

	public String getSubmittedString() {
		return submittedString;
	}

	public void setSubmittedString(String submittedString) {
		this.submittedString = submittedString;
	}

	public String getResolvedString() {
		return resolvedString;
	}

	public void setResolvedString(String resolvedString) {
		this.resolvedString = resolvedString;
	}

	public String getAuthorString() {
		return authorString;
	}

	public void setAuthorString(String authorString) {
		this.authorString = authorString;
	}

	public String getResolverString() {
		return resolverString;
	}

	public void setResolverString(String resolverString) {
		this.resolverString = resolverString;
	}

	public String getPresignedURL() {
		return presignedURL;
	}

	public void setPresignedURL(String presignedURL) {
		this.presignedURL = presignedURL;
	}
}