-- CREATE DATABASE IF NOT EXISTS purchase_management_db;
-- USE purchase_management_db;

-- Table: Locations
CREATE TABLE Locations (
    location_id VARCHAR(10) PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL
);

-- Table: Items
CREATE TABLE Items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL
);

-- Table: PurchaseHeaders
CREATE TABLE PurchaseHeaders (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    TransactionNo VARCHAR(50) NOT NULL,
    TransactionDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalItems INT NOT NULL DEFAULT 0,
    TotalQuantity DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    TotalAmount DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
);

-- Table: PurchaseItems
CREATE TABLE PurchaseItems (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    PurchaseHeaderId INT NOT NULL,
    ItemId INT NOT NULL,
    LocationId VARCHAR(10) NOT NULL,
    Cost DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    Price DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    Quantity DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    DiscountPercent DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    TotalCost DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    TotalSelling DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (PurchaseHeaderId) REFERENCES PurchaseHeaders(Id) ON DELETE CASCADE,
    FOREIGN KEY (ItemId) REFERENCES Items(item_id),
    FOREIGN KEY (LocationId) REFERENCES Locations(location_id)
);

-- Table: Audit_Logs
CREATE TABLE Audit_Logs (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Entity VARCHAR(255) NOT NULL,
    Action VARCHAR(100) NOT NULL,
    OldValue TEXT NULL,
    NewValue TEXT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data (Optional)
-- INSERT INTO Locations (location_id, location_name) VALUES ('L001', 'Main Warehouse'), ('L002', 'Downtown Branch');
-- INSERT INTO Items (item_name) VALUES ('Laptop'), ('Mouse'), ('Keyboard');
