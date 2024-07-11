

CREATE TABLE Category (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryName VARCHAR(255) NOT NULL,
  parentCategoryId INT,
  FOREIGN KEY (parentCategoryId) REFERENCES Category(id)
);


CREATE TABLE Product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price FLOAT NOT NULL,
  categoryId INT NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES Category(id)
);

CREATE TABLE Stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL,
  productId INT NOT NULL,
  FOREIGN KEY (productId) REFERENCES Product(id)
);

CREATE TABLE `Order` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  orderDate DATETIME NOT NULL,
  totalAmount FLOAT NOT NULL
);

CREATE TABLE OrderItem (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantity INT NOT NULL,
  price FLOAT NOT NULL,
  orderId INT NOT NULL,
  productId INT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES `Order`(id),
  FOREIGN KEY (productId) REFERENCES Product(id)
);

