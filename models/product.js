class Product {
  constructor({
    pid,
    name,
    sold = 0,
    price,
    cid,
    image,
    available = true,
    deliveryTime,
    description,
    availableQuantity = 0,
  }) {
    this.pid = pid;
    this.name = name;
    this.sold = sold;
    this.price = price;
    this.cid = cid;
    this.image = image;
    this.available = available;
    this.deliveryTime = deliveryTime;
    this.description = description;
    this.availableQuantity = availableQuantity;
  }
}
export default Product;
