class RegisterDto {
    constructor(newUser) {
        this.firstName = newUser.firstName;
        this.lastName = newUser.lastName;
        this.email = newUser.email;
        this.role = newUser.role;
        this.birthday = newUser.birthday;
    }
}

export default RegisterDto;
