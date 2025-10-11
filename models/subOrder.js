class SubOrder {
  constructor({
    soid,
    oid,
    uid,
    status,
    dateTime = new Date(),
    shippingMethodName,
  }) {
    this.soid = soid;
    this.oid = oid;
    this.uid = uid;
    this.status = status;
    this.dateTime = dateTime;
    this.shippingMethodName = shippingMethodName;
  }
}

export default SubOrder;
