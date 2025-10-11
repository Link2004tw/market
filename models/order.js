class Order {
  constructor({
    oid,
    uid,
    payment,
    location,
    status,
    dateTime = new Date(),
    shipment,
  }) {
    this.oid = oid;
    this.uid = uid;
    this.payment = payment;
    this.location = location;
    this.status = status;
    this.dateTime = dateTime;
    this.shipment = shipment;
  }
}
export default Order;
