function SignupValidation(inputValues) {
    let errors = {};
    let emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    var passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;
    if(inputValues.fname === ""){
        errors.fname = "This field should not be empty"
    }
    if(inputValues.lname === ""){
        errors.lname = "This field should not be empty"
    }
    if (!emailRegex.test(inputValues.email)) {
        errors.email = "Please enter a valid email";
    }
    if (inputValues.password.length < 8 || !passwordRegex.test(inputValues.password)) {
        errors.password = "Password must contain at least 8 characters including a upper and lower letter, number, special character such as (#?!@$%^&*-_)";
    }
    if (inputValues.contact.length > 10 || inputValues.contact.length < 10) {
        errors.contact = "Contact number must be of 10 digits";
    }
    return errors;
};

export default SignupValidation