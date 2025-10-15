import User from "./user";

class Buyer extends User {
  constructor(
    uID,
    username,
    email,
    phoneNumber,
    profileImage,
    lastLogin,
    street,
    province,
    governorate
  ) {
    super(uID, username, email, phoneNumber, profileImage, lastLogin); // Inherit User properties
    this.street = street; // VARCHAR(255)
    this.province = province; // VARCHAR(100)
    this.governorate = governorate; // VARCHAR(100)
  }
}

export default Buyer;
