function AddpatientValidation(inputValues) {
    let errors = {};
    let emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    if (inputValues.name === "") {
        errors.name = "This field should not be empty"
    }
    if (inputValues.gender === "") {
        errors.gender = "This field should not be empty"
    }
    if (inputValues.email) {
        if (!emailRegex.test(inputValues.email)) {
            errors.email = "Please enter a valid email";
        }
    }
    if (inputValues.contact.length > 10 || inputValues.contact.length < 10) {
        errors.contact = "Contact number must not be empty and exactly 10 digits";
    }
    return errors;
};

export default AddpatientValidation