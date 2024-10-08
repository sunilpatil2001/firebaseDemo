function SigninValidation(inputValues) {
    let errors = {};
    if(inputValues.email === ""){
        errors.email = "This field should not be empty"
    }
    if(inputValues.pass === ""){
        errors.pass = "This field should not be empty"
    }
    return errors;
};

export default SigninValidation