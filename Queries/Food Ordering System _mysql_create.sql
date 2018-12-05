
use foodordersystem;

CREATE TABLE `Company` (
	`CompanyID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255),
	`Address` varchar(255),
	`PhoneNumber` varchar(255),
	`Info` varchar(255),
	`DateCreated` DATETIME DEFAULT now(),
	`DateModified` DATETIME,
	`DateDeleted` DATETIME,
	PRIMARY KEY (`CompanyID`)
);

CREATE TABLE `CompanySettings` (
	`SettingID` bigint(255) NOT NULL AUTO_INCREMENT,
	`CompanyID` bigint(255) NOT NULL,
	`Name` varchar(255) ,
	`Value` varchar(255) ,
	`DateCreated` DATETIME  DEFAULT now(),
	`DateModified` DATETIME ,
	`DateDeleted` DATETIME ,
	PRIMARY KEY (`SettingID`)
);

CREATE TABLE `Categories` (
	`CategoryID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255),
	`Description` varchar(255),
	`DateCreated` DATETIME DEFAULT now(),
	`DateModified` DATETIME,
	`DateDeleted` DATETIME,
	`CompanyID` bigint(255) NOT NULL,
	PRIMARY KEY (`CategoryID`)
);

CREATE TABLE `Items` (
	`ItemID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255),
	`Description` varchar(255),
	`Price` bigint(255) NOT NULL,
	`Available` tinyint(1) NOT NULL DEFAULT '1',
	`Image` varchar(255),
	`DateCreated` DATETIME DEFAULT now(),
	`DateModified` DATETIME,
	`DateDeleted` DATETIME,
	`CategoryID` bigint(255) NOT NULL,
	`CompanyID` bigint(255) NOT NULL,
	PRIMARY KEY (`ItemID`)
);

CREATE TABLE `Customers` (
	`CustomerID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255),
	`Email` varchar(255) NOT NULL,
	`Address` varchar(255),
	`PhoneNumber` varchar(255),
	`Image` varchar(255),
	`DateCreated` DATETIME DEFAULT now(),
	`DateModified` DATETIME,
	`DateDeleted` DATETIME,
	`CompanyID` bigint(255) NOT NULL,
	PRIMARY KEY (`CustomerID`)
);

CREATE TABLE `Employee` (
	`EmployeeID` bigint(255) NOT NULL AUTO_INCREMENT,
	`UserName` varchar(255) NOT NULL,
	`Password` varchar(255) NOT NULL,
	`RoleID` bigint(255) NOT NULL,
	`CompanyID` bigint(255) NOT NULL,
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	PRIMARY KEY (`EmployeeID`)
);

CREATE TABLE `Roles` (
	`RoleID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255) NOT NULL,
	`Code` varchar(255),
	`CompanyID` bigint(255) NOT NULL,
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	PRIMARY KEY (`RoleID`)
);

CREATE TABLE `Orders` (
	`OrderID` bigint(255) NOT NULL AUTO_INCREMENT,
	`OrderDate` DATETIME,
	`CustomerID` bigint(255) NOT NULL,
	`CompanyID` bigint(255) NOT NULL,
	`DeliveryID` bigint(255) NOT NULL,
	`OrderStatusID` bigint(255),
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	PRIMARY KEY (`OrderID`)
);

CREATE TABLE `Orders_Items` (
	`OrderItemID` bigint(255) NOT NULL AUTO_INCREMENT,
	`OrderID` bigint(255) NOT NULL,
	`ItemID` bigint(255) NOT NULL,
	`Quantity` bigint(255) NOT NULL,
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	PRIMARY KEY (`OrderItemID`)
);

CREATE TABLE `OrderStatuses` (
	`OrderStatusID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255) NOT NULL,
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	PRIMARY KEY (`OrderStatusID`)
);

CREATE TABLE `DeliveryAddress` (
	`DeliveryAddressID` bigint(255) NOT NULL AUTO_INCREMENT,
	`Name` bigint(255) NOT NULL,
	`Description` varchar(255) NOT NULL,
	`Latitude` varchar(255),
	`Longitude` varchar(255),	
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	`CustomerID` bigint(255) NOT NULL,
	PRIMARY KEY (`DeliveryAddressID`)
);

CREATE TABLE `Deliveries` (
	`DeliveryID` bigint(255) NOT NULL AUTO_INCREMENT ,
	`DeliveryDate` DATE NOT NULL ,
	`DeliveryTime` TIME NOT NULL ,
	`DeliveryAddressID` bigint(255) NOT NULL,
	`DateCreated` DATETIME NOT NULL DEFAULT now(),
	`DateModified` DATETIME NOT NULL,
	`DateDeleted` DATETIME NOT NULL,
	PRIMARY KEY (`DeliveryID`)
);

ALTER TABLE `CompanySettings` ADD CONSTRAINT `CompanySettings_fk0` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Categories` ADD CONSTRAINT `Categories_fk0` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Items` ADD CONSTRAINT `Items_fk0` FOREIGN KEY (`CategoryID`) REFERENCES `Categories`(`CategoryID`);

ALTER TABLE `Items` ADD CONSTRAINT `Items_fk1` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Customers` ADD CONSTRAINT `Customers_fk0` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Employee` ADD CONSTRAINT `Employee_fk0` FOREIGN KEY (`RoleID`) REFERENCES `Roles`(`RoleID`);

ALTER TABLE `Employee` ADD CONSTRAINT `Employee_fk1` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Roles` ADD CONSTRAINT `Roles_fk0` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Orders` ADD CONSTRAINT `Orders_fk0` FOREIGN KEY (`CustomerID`) REFERENCES `Customers`(`CustomerID`);

ALTER TABLE `Orders` ADD CONSTRAINT `Orders_fk1` FOREIGN KEY (`CompanyID`) REFERENCES `Company`(`CompanyID`);

ALTER TABLE `Orders` ADD CONSTRAINT `Orders_fk2` FOREIGN KEY (`OrderStatusID`) REFERENCES `OrderStatuses`(`OrderStatusID`);

ALTER TABLE `Orders` ADD CONSTRAINT `Orders_fk3` FOREIGN KEY (`DeliveryID`) REFERENCES `Deliveries`(`DeliveryID`);


ALTER TABLE `Orders_Items` ADD CONSTRAINT `Orders_Items_fk0` FOREIGN KEY (`OrderID`) REFERENCES `Orders`(`OrderID`);

ALTER TABLE `Orders_Items` ADD CONSTRAINT `Orders_Items_fk1` FOREIGN KEY (`ItemID`) REFERENCES `Items`(`ItemID`);

ALTER TABLE `DeliveryAddress` ADD CONSTRAINT `DeliveryAddress_fk0` FOREIGN KEY (`CustomerID`) REFERENCES `Customers`(`CustomerID`);

ALTER TABLE `Deliveries` ADD CONSTRAINT `Deliveries_fk0` FOREIGN KEY (`DeliveryAddressID`) REFERENCES `DeliveryAddress`(`DeliveryAddressID`);

ALTER TABLE `Items`  AUTO_INCREMENT = 1;
ALTER TABLE `CompanySettings`  AUTO_INCREMENT = 1;
ALTER TABLE `Deliveries`  AUTO_INCREMENT = 1;
ALTER TABLE `DeliveryAddress`  AUTO_INCREMENT = 1;
ALTER TABLE `Orders_Items`  AUTO_INCREMENT = 1;
ALTER TABLE `Orders`  AUTO_INCREMENT = 1;
ALTER TABLE `Company`  AUTO_INCREMENT = 1;
ALTER TABLE `Employee`  AUTO_INCREMENT = 1;
ALTER TABLE `Roles`  AUTO_INCREMENT = 1;
ALTER TABLE `Orderstatuses`  AUTO_INCREMENT = 1;
ALTER TABLE `Categories`  AUTO_INCREMENT = 1;
ALTER TABLE `Customers`  AUTO_INCREMENT = 1;




