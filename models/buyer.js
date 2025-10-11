import User from "./user.js";
class Buyer extends User {
  constructor({ uid, username, email, phoneNumber, funds = 0.0, address }) {
    super({ uid, username, email, phoneNumber, funds });
    this.address = address;
  }
}
export default Buyer;
