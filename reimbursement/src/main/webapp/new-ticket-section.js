
class NewTicketSection {

    //new ticket "amount" text input
    addAmountListener() {

        $("#amount_text").blur(function(){
            //convert to float
            const amountFloat = newTicketSection.getAmount();

            //format in US dollars
            const amountInDollars = shared.formatCurrency(amountFloat);

            this.value = amountInDollars;

            //show "required" message if amount is 0
            newTicketSection.validateAmount();
        });
    }

    //"clear receipt" button used when attaching receipt to new ticket
    addClearReceiptListener() {

        $("#clear_receipt_button").click(() => {

            //remove receipt
            $("#receipt_file").val("");
        });
    }

    //new ticket "type" select
    addTypeListener() {

        $("#type_select").change(() => {

            //show "required" message if "none" selected
            this.validateType();
        });
    }

    //new ticket "description" text area
    addDescriptionListener() {

        $("#description_textarea").blur(() => {

            //show "required" if empty
            this.validateDescription();
        });
    }

    //new ticket button listener
    addNewTicketListener() {

        $("#new_ticket_button").click(function() {

            const form = $("#new_ticket_form");

            //if form not displayed
            if (form.css("display") === "none") {
                form.css("display", "block"); //display
                
                this.disabled = true;

                //clear form
                newTicketSection.clearForm();
            }
        });
    }

    //submit ticket button listener
    addSubmitTicketListener() {

        $("#submit").click((e) => {

            //validate form
            const isValid = this.validateForm();
            if(isValid) { //if valid

                //get form fields
                const typeId_ = $("#type_select").val();

                const files = $("#receipt_file").prop("files");
                const hasReceipt_ = files.length > 0 ? "true" : ""; //this will be a string in Java

                //put in post params
                const params = {
                    amount: this.getAmount(),
                    description: $("#description_textarea").val(),
                    hasReceipt: hasReceipt_, //simply let Java know we have a receipt so the presigned url will be returned
                    typeId: typeId_
                };

                //we are using presigned urls, so we no longer need to upload the receipt
                // if(files.length > 0) {
                //     shared.postRequestMultiPart(params, files[0], "http://localhost:8080/reimbursement/insert-multipart", (json, statusCode, errorMessage)=> {

                //         this.onSubmit(errorMessage, files[0], json);
                //     });
                // }
                // else {
                    shared.postRequest(params, "http://localhost:8080/reimbursement/insert", (json, statusCode, errorMessage)=> {

                        this.onSubmit(errorMessage, files[0], json);
                    });
                // }
            }

            e.preventDefault();
        });
    }

    //clear new ticket form
    clearForm() {

        $("#amount_text").val("");
        shared.addClass("amount_required", "hide");

        $("#type_select").val(0);
        shared.addClass("select_required", "hide");

        $("#description_textarea").val("");
        shared.addClass("description_required", "hide");
            
        $("#receipt_file").val("");
    }

    //new ticket post request callback
    onSubmit(errorMessage, receiptFile, ticket) {

        //if error
        if (errorMessage) {

            //display error
            const error = $("#submit_error");
            error.text(errorMessage);
            error.prop("classList").remove("hide");
        }
        else {

            if(receiptFile)
            {
                shared.putRequestAWS(receiptFile, receiptFile.type, ticket.presignedURL, ()=> {

                    shared.addClass("submit_error", "hide");

                    this.onReceiptHandled(ticket);
                });
            }
            else {
                this.onReceiptHandled(ticket);
            }
        }
    }

    //the receipt was uploaded to AWS (or not if not attached by user)
    onReceiptHandled(ticket) {

        //update ticket tables
        if(shared.user.roleId === ROLE_MANAGER) {
            managerSection.onNewTicket(ticket);
        }
        myTicketsSection.onNewTicket(ticket);

        //clear form
        this.clearForm();

        //close the section
        $("#new_ticket_form").css("display", "none");

        //enable new ticket button
        $("#new_ticket_button").prop("disabled", false);
    }

    //convert the new ticket amount to a Number
    getAmount() {

        //remove negative, dollar sign, and commas
        const noDollarSign = $("#amount_text").val().replace('-', '').replace('$', '').replace(/,/g, '');
        const amountNumber = Number.parseFloat(noDollarSign);

        if (Number.isNaN(amountNumber)) {
            return 0;
        }

        return amountNumber;
    }

    //show the new ticket section
    showSection() {

        $("#new_ticket_section").css("display", "block");
    }

    //validate the new ticket form amount
    validateAmount() {
        const amountRequired = $("#amount_required");

        const noDollarSign = $("#amount_text").val().replace('$', ''); //remove dollar sign
        const amountNumber = Number.parseFloat(noDollarSign); //convert to float

        //if amount is invalid
        let isValid = true;
        if (!amountNumber || Number.isNaN(amountNumber) || amountNumber === 0) {
            isValid = false;
            amountRequired.prop("classList").remove("hide"); //show "required" error
        }
        else {
            amountRequired.prop("classList").add("hide");
        }

        return isValid;
    }

    //validate the new ticket form type
    validateType() {

        const typeRequired = $("#select_required");
        let isValid = true;
        if ($("#type_select").val() == 0) { //if type not selected
            isValid = false;
            typeRequired.prop("classList").remove("hide"); //show "required"
        }
        else {
            typeRequired.prop("classList").add("hide");
        }
        return isValid;
    }

    //validate the new ticket form description
    validateDescription() {
        const descriptionRequired = $("#description_required");
        let isValid = true;
        
        const desc = $("#description_textarea").val();

        //if empty
        if (!desc) {
            isValid = false;
            descriptionRequired.text("required");
            descriptionRequired.prop("classList").remove("hide"); //show "required"
        }
        //if too long
        else if(desc.length > 499) {
            isValid = false;
            descriptionRequired.text("Description is too long");
            descriptionRequired.prop("classList").remove("hide");
        }
        else {
            descriptionRequired.prop("classList").add("hide");
        }
        return isValid;
    }

    //validate the entire new ticket form
    validateForm() {

        let isValid = this.validateAmount();

        if(!this.validateType()) {
            isValid = false;
        }

        if(!this.validateDescription()) {
            isValid = false;
        }

        return isValid;
    }    
}
const newTicketSection = new NewTicketSection();