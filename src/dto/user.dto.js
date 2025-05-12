class UserDto {
    constructor(data) {
        this.fullName = data.firstName + " " + data.lastName;
        this.email = data.email;
        this.role = data.role;
        this.avatar = data.avatar;
        this.birthday = data.birthday;
        this.last_connection = data.last_connection;
    }
}

export default UserDto;
