class Order {
  constructor({ oid, uid, payment, location, status, dateTime = new Date() }) {
    this.oid = oid;
    this.uid = uid;
    this.payment = payment;
    this.location = location;
    this.status = status;
    this.dateTime = dateTime;
  }
}
export default Order;
