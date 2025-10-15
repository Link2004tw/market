class User {
  constructor(uID, username, email, phoneNumber, profileImage, lastLogin) {
    this.uID = uID; // UUID referencing auth.users(id)
    this.username = username; // VARCHAR(255) NOT NULL
    this.email = email; // VARCHAR(255) UNIQUE NOT NULL
    this.phoneNumber = phoneNumber; // VARCHAR(20)
    this.profileImage = profileImage; // VARCHAR(255)
    this.lastLogin = lastLogin || new Date().toISOString(); // Default to current timestamp if not provided
  }
  toJSON() {
    return {
      uID: this.uID,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      profileImage: this.profileImage,
      lastLogin: this.lastLogin,
    };
  }
}

export default User;
