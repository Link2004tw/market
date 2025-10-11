export default class User {
  constructor({ uid, username, email, phoneNumber, funds = 0.0 }) {
    this.uid = uid;
    this.username = username;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.funds = funds;
  }
}
