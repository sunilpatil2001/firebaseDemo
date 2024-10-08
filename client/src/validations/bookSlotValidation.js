function BookslotValidation(inputValues) {
    let errors = {};
    if(inputValues.name === ""){
        errors.name = "This field should not be empty"
    }
    if(inputValues.date === ""){
        errors.date = "This field should not be empty"
    }
    if(inputValues.time === ""){
        errors.time = "This field should not be empty"
    }
    return errors;
};

export default BookslotValidation