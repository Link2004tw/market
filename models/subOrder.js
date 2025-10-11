class SubOrder {
  constructor({ soid, oid, uid, status, dateTime = new Date() }) {
    this.soid = soid;
    this.oid = oid;
    this.uid = uid;
    this.status = status;
    this.dateTime = dateTime;
  }
}

export default SubOrder;
