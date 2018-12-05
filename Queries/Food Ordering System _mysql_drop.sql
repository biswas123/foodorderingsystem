ALTER TABLE `CompanySettings` DROP FOREIGN KEY `CompanySettings_fk0`;

ALTER TABLE `Categories` DROP FOREIGN KEY `Categories_fk0`;

ALTER TABLE `Items` DROP FOREIGN KEY `Items_fk0`;

ALTER TABLE `Items` DROP FOREIGN KEY `Items_fk1`;

ALTER TABLE `Customers` DROP FOREIGN KEY `Customers_fk0`;

ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_fk0`;

ALTER TABLE `Employee` DROP FOREIGN KEY `Employee_fk1`;

ALTER TABLE `Roles` DROP FOREIGN KEY `Roles_fk0`;

ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_fk0`;

ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_fk1`;

ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_fk2`;

ALTER TABLE `Orders_Items` DROP FOREIGN KEY `Orders_Items_fk0`;

ALTER TABLE `Orders_Items` DROP FOREIGN KEY `Orders_Items_fk1`;

ALTER TABLE `DeliveryAddress` DROP FOREIGN KEY `DeliveryAddress_fk0`;

ALTER TABLE `Deliveries` DROP FOREIGN KEY `Deliveries_fk0`;

DROP TABLE IF EXISTS `Company`;

DROP TABLE IF EXISTS `CompanySettings`;

DROP TABLE IF EXISTS `Categories`;

DROP TABLE IF EXISTS `Items`;

DROP TABLE IF EXISTS `Customers`;

DROP TABLE IF EXISTS `Employee`;

DROP TABLE IF EXISTS `Roles`;

DROP TABLE IF EXISTS `Orders`;

DROP TABLE IF EXISTS `Orders_Items`;

DROP TABLE IF EXISTS `OrderStatuses`;

DROP TABLE IF EXISTS `DeliveryAddress`;

DROP TABLE IF EXISTS `Deliveries`;

