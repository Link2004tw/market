import User from "./user";

class Seller extends User {
  constructor({
    uid,
    username,
    email,
    phoneNumber,
    funds = 0.0,
    serviceArea,
    priority,
  }) {
    super({ uid, username, email, phoneNumber, funds });
    this.serviceArea = serviceArea;
    this.priority = priority;
  }
}
export default Seller;
