import User from "./user";

class Seller extends User {
  constructor(
    uID,
    username,
    email,
    phoneNumber,
    profileImage,
    lastLogin,
    priority,
    hasExpress
  ) {
    super(uID, username, email, phoneNumber, profileImage, lastLogin); // Inherit User properties
    this.priority = priority; // INT
    this.hasExpress = hasExpress; // boolean
  }
}

export default Seller;
