class UserDto {
    constructor(data) {
        this.id = data.id;
        this.fullName = data.firstName + " " + data.lastName;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.role = data.role;
        this.avatar = data.avatar;
        this.birthday = data.birthday;
        this.last_connection = data.last_connection;
    }
}

export default UserDto;
