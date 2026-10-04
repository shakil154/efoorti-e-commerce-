-- ============================================================
--  Shopzy — Full Database Dump (Schema + Data)
--  Generated: 2026-08-15
--  Tables: 29
-- ============================================================
-- Usage (phpMyAdmin):
--   1. Create a new database (e.g. "shopzy_prod")
--   2. Select the database → Import → choose this file → Go
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- Data appended below:
DROP TABLE IF EXISTS `abandoned_checkouts`;
CREATE TABLE `abandoned_checkouts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `cart_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cart_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cart_items`)),
  `is_recovered` tinyint(1) NOT NULL DEFAULT 0,
  `admin_note` text DEFAULT NULL,
  `last_active_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `abandoned_checkouts_session_id_unique` (`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `button_text` varchar(255) DEFAULT NULL,
  `placement` varchar(255) NOT NULL DEFAULT 'hero',
  `style` varchar(30) NOT NULL DEFAULT 'brand',
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `blocked_devices`;
CREATE TABLE `blocked_devices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `device_hash` varchar(64) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blocked_devices_device_hash_unique` (`device_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `blocked_ips`;
CREATE TABLE `blocked_ips` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blocked_ips_ip_address_unique` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `blocked_phones`;
CREATE TABLE `blocked_phones` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blocked_phones_phone_unique` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `meta_keywords` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_parent_id_foreign` (`parent_id`),
  KEY `categories_is_active_position_index` (`is_active`,`position`),
  CONSTRAINT `categories_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `contact_form_fields`;
CREATE TABLE `contact_form_fields` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(60) NOT NULL,
  `label` varchar(120) NOT NULL,
  `type` varchar(30) NOT NULL DEFAULT 'text',
  `placeholder` varchar(180) DEFAULT NULL,
  `help_text` varchar(255) DEFAULT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`options`)),
  `is_required` tinyint(1) NOT NULL DEFAULT 0,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `accept` varchar(120) DEFAULT NULL,
  `max_size_kb` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contact_form_fields_key_unique` (`key`),
  KEY `contact_form_fields_is_active_position_index` (`is_active`,`position`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `contact_message_values`;
CREATE TABLE `contact_message_values` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `contact_message_id` bigint(20) unsigned NOT NULL,
  `field_key` varchar(60) NOT NULL,
  `field_label` varchar(120) NOT NULL,
  `field_type` varchar(30) NOT NULL DEFAULT 'text',
  `value` text DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_name` varchar(180) DEFAULT NULL,
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_message_values_contact_message_id_position_index` (`contact_message_id`,`position`),
  CONSTRAINT `contact_message_values_contact_message_id_foreign` FOREIGN KEY (`contact_message_id`) REFERENCES `contact_messages` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(20) NOT NULL DEFAULT 'new',
  `name` varchar(180) DEFAULT NULL,
  `email` varchar(180) DEFAULT NULL,
  `phone` varchar(60) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_messages_status_created_at_index` (`status`,`created_at`),
  KEY `contact_messages_email_index` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'percentage',
  `value` decimal(12,2) NOT NULL,
  `min_order_amount` decimal(12,2) DEFAULT NULL,
  `max_discount` decimal(12,2) DEFAULT NULL,
  `max_uses` int(10) unsigned DEFAULT NULL,
  `used_count` int(10) unsigned NOT NULL DEFAULT 0,
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`),
  KEY `coupons_is_active_index` (`is_active`),
  KEY `coupons_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `email_otps`;
CREATE TABLE `email_otps` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `purpose` varchar(255) NOT NULL DEFAULT 'register',
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `consumed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_otps_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `icon` text DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `landing_pages`;
CREATE TABLE `landing_pages` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `design` varchar(40) NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`content`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `landing_pages_slug_unique` (`slug`),
  KEY `landing_pages_product_id_foreign` (`product_id`),
  CONSTRAINT `landing_pages_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `quantity` int(10) unsigned NOT NULL DEFAULT 1,
  `line_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `confirmation_token` varchar(64) DEFAULT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `shipping_zone` varchar(255) NOT NULL DEFAULT 'inside_dhaka',
  `coupon_id` bigint(20) unsigned DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `shipping_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(255) NOT NULL DEFAULT 'cod',
  `payment_sender_number` varchar(255) DEFAULT NULL,
  `payment_txn_id` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `device_hash` varchar(64) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `courier_provider` varchar(255) DEFAULT NULL,
  `courier_tracking_code` varchar(255) DEFAULT NULL,
  `courier_consignment_id` varchar(255) DEFAULT NULL,
  `courier_status` varchar(255) DEFAULT NULL,
  `internal_note` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  UNIQUE KEY `orders_confirmation_token_unique` (`confirmation_token`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_status_index` (`status`),
  KEY `orders_payment_status_index` (`payment_status`),
  KEY `orders_coupon_id_foreign` (`coupon_id`),
  CONSTRAINT `orders_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `path` varchar(255) NOT NULL,
  `alt` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_position_index` (`product_id`,`position`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE `product_reviews` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `author_name` varchar(120) NOT NULL,
  `author_email` varchar(120) DEFAULT NULL,
  `rating` tinyint(3) unsigned NOT NULL,
  `title` varchar(180) DEFAULT NULL,
  `body` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `is_verified_purchase` tinyint(1) NOT NULL DEFAULT 0,
  `approved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_reviews_user_id_foreign` (`user_id`),
  KEY `product_reviews_product_id_status_index` (`product_id`,`status`),
  KEY `product_reviews_status_created_at_index` (`status`,`created_at`),
  CONSTRAINT `product_reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `price_delta` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock` int(10) unsigned NOT NULL DEFAULT 0,
  `position` int(10) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variants_product_id_foreign` (`product_id`),
  CONSTRAINT `product_variants_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `short_description` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `specifications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specifications`)),
  `regular_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `stock_quantity` int(10) unsigned NOT NULL DEFAULT 0,
  `unit` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_new_arrival` tinyint(1) NOT NULL DEFAULT 0,
  `is_best_seller` tinyint(1) NOT NULL DEFAULT 0,
  `is_flash_sale` tinyint(1) NOT NULL DEFAULT 0,
  `flash_sale_position` int(10) unsigned NOT NULL DEFAULT 0,
  `flash_sale_progress` tinyint(3) unsigned NOT NULL DEFAULT 50,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviews_count` int(10) unsigned NOT NULL DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `meta_keywords` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_is_published_is_featured_index` (`is_published`,`is_featured`),
  KEY `products_is_published_is_best_seller_index` (`is_published`,`is_best_seller`),
  KEY `products_is_published_is_new_arrival_index` (`is_published`,`is_new_arrival`),
  KEY `products_is_published_is_flash_sale_flash_sale_position_index` (`is_published`,`is_flash_sale`,`flash_sale_position`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_unique` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'customer',
  `permissions` json DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postal_code` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `abandoned_checkouts` (`id`, `session_id`, `customer_name`, `customer_phone`, `customer_email`, `shipping_address`, `cart_total`, `cart_items`, `is_recovered`, `admin_note`, `last_active_at`, `created_at`, `updated_at`) VALUES
('1', 'MrZYTjFLz8AZ3wx2FZ1lG1vzW6GCz9lxnJ0kLfLT', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', 'Abodned cart', '743.00', '[{\"key\":\"28|Size: L, Color: test, Weight: 10\",\"product\":{\"id\":28,\"category_id\":4,\"name\":\"Face Mask Sheet Pack 10\",\"slug\":\"face-mask-sheet-pack-10\",\"sku\":\"SZ-891A21\",\"brand\":\"GlowLab\",\"short_description\":\"Shop Face Mask Sheet Pack 10 from our Health & Beauty collection - authentic products at Shopzy marketplace.\",\"description\":\"The Face Mask Sheet Pack 10 by GlowLab is a top pick in our Health & Beauty category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Health & Beauty collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"900.00\",\"sale_price\":\"650.00\",\"stock_quantity\":46,\"unit\":\"1 pack\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":false,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.40\",\"reviews_count\":122,\"meta_title\":\"Face Mask Sheet Pack 10 - GlowLab | Buy Online at Projoss\",\"meta_description\":\"Buy Face Mask Sheet Pack 10 by GlowLab at Shopzy marketplace. Shop Face Mask Sheet Pack 10 from our Health & Beauty collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"face mask sheet pack 10, glowlab, health & beauty, buy face mask sheet pack 10 online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:12.000000Z\",\"updated_at\":\"2026-08-12T23:16:42.000000Z\",\"images\":[{\"id\":130,\"product_id\":28,\"path\":\"uploads\\/products\\/44bbf796-0498-48ad-8f3e-0a89d4001e31.jpeg\",\"alt\":\"Face Mask Sheet Pack 10\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:51:30.000000Z\",\"updated_at\":\"2026-08-12T22:51:30.000000Z\"},{\"id\":131,\"product_id\":28,\"path\":\"uploads\\/products\\/94049a47-9ff6-4e66-8673-d93361564664.jpeg\",\"alt\":\"Face Mask Sheet Pack 10\",\"is_primary\":false,\"position\":2,\"created_at\":\"2026-08-12T22:51:31.000000Z\",\"updated_at\":\"2026-08-12T22:51:31.000000Z\"}],\"variants\":[{\"id\":85,\"product_id\":28,\"type\":\"Size\",\"value\":\"L\",\"price_delta\":\"0.00\",\"stock\":0,\"position\":0,\"created_at\":\"2026-08-12T23:16:19.000000Z\",\"updated_at\":\"2026-08-12T23:16:19.000000Z\"},{\"id\":86,\"product_id\":28,\"type\":\"Size\",\"value\":\"X\",\"price_delta\":\"0.00\",\"stock\":0,\"position\":1,\"created_at\":\"2026-08-12T23:16:19.000000Z\",\"updated_at\":\"2026-08-12T23:16:19.000000Z\"},{\"id\":87,\"product_id\":28,\"type\":\"Color\",\"value\":\"test\",\"price_delta\":\"0.00\",\"stock\":0,\"position\":2,\"created_at\":\"2026-08-12T23:16:19.000000Z\",\"updated_at\":\"2026-08-12T23:16:19.000000Z\"},{\"id\":88,\"product_id\":28,\"type\":\"Weight\",\"value\":\"10\",\"price_delta\":\"0.00\",\"stock\":0,\"position\":3,\"created_at\":\"2026-08-12T23:16:19.000000Z\",\"updated_at\":\"2026-08-12T23:16:19.000000Z\"},{\"id\":89,\"product_id\":28,\"type\":\"Weight\",\"value\":\"29\",\"price_delta\":\"0.00\",\"stock\":0,\"position\":4,\"created_at\":\"2026-08-12T23:16:19.000000Z\",\"updated_at\":\"2026-08-12T23:16:19.000000Z\"}]},\"product_id\":28,\"name\":\"Face Mask Sheet Pack 10\",\"slug\":\"face-mask-sheet-pack-10\",\"image\":\"http:\\/\\/127.0.0.1:8006\\/uploads\\/products\\/44bbf796-0498-48ad-8f3e-0a89d4001e31.jpeg\",\"variant\":\"Size: L, Color: test, Weight: 10\",\"price\":650,\"unit_price\":650,\"qty\":1,\"line_total\":650}]', '1', NULL, '2026-08-12 23:29:44', '2026-08-12 23:24:51', '2026-08-12 23:42:46'),
('2', 'MAeSbhfjm43HmViG0d7F53nZwIsSpkJyQdgRm7F5', 'Md Sabuj', '01923443872', NULL, 'Village: Lahiribar, Post Office: Khupibari', '30465.00', '[{\"key\":\"6|Color: Black\",\"product\":{\"id\":6,\"category_id\":10,\"name\":\"Redmi Note 13 Pro\",\"slug\":\"redmi-note-13-pro\",\"sku\":\"SZ-9FD677\",\"brand\":\"Xiaomi\",\"short_description\":\"Shop Redmi Note 13 Pro from our Phones collection - authentic products at Shopzy marketplace.\",\"description\":\"The Redmi Note 13 Pro by Xiaomi is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\n\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\n\\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\n\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":null,\"regular_price\":\"32000.00\",\"sale_price\":\"28900.00\",\"stock_quantity\":127,\"unit\":\"1 unit\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":false,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.75\",\"reviews_count\":4,\"meta_title\":\"Redmi Note 13 Pro - Xiaomi | Buy Online at Shopzy\",\"meta_description\":\"Buy Redmi Note 13 Pro by Xiaomi at Shopzy marketplace. Shop Redmi Note 13 Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"redmi note 13 pro, xiaomi, phones, buy redmi note 13 pro online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:12.000000Z\",\"images\":[{\"id\":21,\"product_id\":6,\"path\":\"https:\\/\\/picsum.photos\\/seed\\/bp-redmi-note-13-pro-1\\/800\\/800\",\"alt\":\"Redmi Note 13 Pro - Xiaomi view 1\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:11.000000Z\"},{\"id\":22,\"product_id\":6,\"path\":\"https:\\/\\/picsum.photos\\/seed\\/bp-redmi-note-13-pro-2\\/800\\/800\",\"alt\":\"Redmi Note 13 Pro - Xiaomi view 2\",\"is_primary\":false,\"position\":2,\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:11.000000Z\"},{\"id\":23,\"product_id\":6,\"path\":\"https:\\/\\/picsum.photos\\/seed\\/bp-redmi-note-13-pro-3\\/800\\/800\",\"alt\":\"Redmi Note 13 Pro - Xiaomi view 3\",\"is_primary\":false,\"position\":3,\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:11.000000Z\"},{\"id\":24,\"product_id\":6,\"path\":\"https:\\/\\/picsum.photos\\/seed\\/bp-redmi-note-13-pro-4\\/800\\/800\",\"alt\":\"Redmi Note 13 Pro - Xiaomi view 4\",\"is_primary\":false,\"position\":4,\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:11.000000Z\"}],\"variants\":[{\"id\":9,\"product_id\":6,\"type\":\"Color\",\"value\":\"Black\",\"price_delta\":\"0.00\",\"stock\":34,\"position\":0,\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:11.000000Z\"},{\"id\":10,\"product_id\":6,\"type\":\"Color\",\"value\":\"Green\",\"price_delta\":\"100.00\",\"stock\":24,\"position\":1,\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-02T03:28:11.000000Z\"}]},\"product_id\":6,\"name\":\"Redmi Note 13 Pro\",\"slug\":\"redmi-note-13-pro\",\"image\":\"https:\\/\\/picsum.photos\\/seed\\/bp-redmi-note-13-pro-1\\/800\\/800\",\"variant\":\"Color: Black\",\"price\":28900,\"unit_price\":28900,\"qty\":1,\"line_total\":28900}]', '0', NULL, '2026-08-13 00:27:04', '2026-08-13 00:27:04', '2026-08-13 00:27:04'),
('3', 'E0LUyNGyu2hMwF48TYx6jrQB3jgoOBHi2tZ9jTRa', 'Store Admin', '01923443872', 'admin@projoss.com', 'Village: Lahiribar, Post Office: Khupibari', '1634.00', '[{\"key\":\"7|Color: White\",\"product\":{\"id\":7,\"category_id\":10,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"sku\":\"SZ-465E60\",\"brand\":\"SoundHub\",\"short_description\":\"Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace.\",\"description\":\"The Wireless Earbuds Pro by SoundHub is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"2990.00\",\"sale_price\":\"1499.00\",\"stock_quantity\":63,\"unit\":\"1 unit\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":true,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.50\",\"reviews_count\":2,\"meta_title\":\"Wireless Earbuds Pro - SoundHub | Buy Online at Projoss\",\"meta_description\":\"Buy Wireless Earbuds Pro by SoundHub at Shopzy marketplace. Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"wireless earbuds pro, soundhub, phones, buy wireless earbuds pro online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-13T00:51:03.000000Z\",\"images\":[{\"id\":140,\"product_id\":7,\"path\":\"uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"alt\":\"Wireless Earbuds Pro\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}],\"variants\":[{\"id\":71,\"product_id\":7,\"type\":\"Color\",\"value\":\"White\",\"price_delta\":\"0.00\",\"stock\":20,\"position\":0,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"},{\"id\":72,\"product_id\":7,\"type\":\"Color\",\"value\":\"Black\",\"price_delta\":\"100.00\",\"stock\":36,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}]},\"product_id\":7,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"variant\":\"Color: White\",\"price\":1499,\"unit_price\":1499,\"qty\":1,\"line_total\":1499}]', '0', NULL, '2026-08-13 15:59:27', '2026-08-13 15:53:24', '2026-08-13 15:59:27'),
('4', 'XFaasZWDGFxv11RKdOOeln2KvLAJ9MvhMfWFj2mZ', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', NULL, '6360.00', '[{\"key\":\"13|Size: 40\",\"product\":{\"id\":13,\"category_id\":2,\"name\":\"Men\'s Casual Leather Sneakers\",\"slug\":\"mens-casual-leather-sneakers\",\"sku\":\"SZ-A73DF7\",\"brand\":\"Aero\",\"short_description\":\"Shop Men\'s Casual Leather Sneakers from our Fashion collection - authentic products at Shopzy marketplace.\",\"description\":\"The Men\'s Casual Leather Sneakers by Aero is a top pick in our Fashion category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Fashion collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"6500.00\",\"sale_price\":\"5600.00\",\"stock_quantity\":65,\"unit\":\"1 pair\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":true,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.90\",\"reviews_count\":468,\"meta_title\":\"Men\'s Casual Leather Sneakers - Aero | Buy Online at Projoss\",\"meta_description\":\"Buy Men\'s Casual Leather Sneakers by Aero at Shopzy marketplace. Shop Men\'s Casual Leather Sneakers from our Fashion collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"men\'s casual leather sneakers, aero, fashion, buy men\'s casual leather sneakers online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-12T22:58:51.000000Z\",\"images\":[{\"id\":143,\"product_id\":13,\"path\":\"uploads\\/products\\/bc71ec1a-0542-4c44-ae05-a737ce5ef16c.webp\",\"alt\":\"Men\'s Casual Leather Sneakers\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:58:51.000000Z\",\"updated_at\":\"2026-08-12T22:58:51.000000Z\"}],\"variants\":[{\"id\":76,\"product_id\":13,\"type\":\"Size\",\"value\":\"40\",\"price_delta\":\"400.00\",\"stock\":31,\"position\":0,\"created_at\":\"2026-08-12T22:58:51.000000Z\",\"updated_at\":\"2026-08-12T22:58:51.000000Z\"},{\"id\":77,\"product_id\":13,\"type\":\"Size\",\"value\":\"41\",\"price_delta\":\"410.00\",\"stock\":29,\"position\":1,\"created_at\":\"2026-08-12T22:58:51.000000Z\",\"updated_at\":\"2026-08-12T22:58:51.000000Z\"},{\"id\":78,\"product_id\":13,\"type\":\"Size\",\"value\":\"42\",\"price_delta\":\"420.00\",\"stock\":28,\"position\":2,\"created_at\":\"2026-08-12T22:58:51.000000Z\",\"updated_at\":\"2026-08-12T22:58:51.000000Z\"},{\"id\":79,\"product_id\":13,\"type\":\"Size\",\"value\":\"43\",\"price_delta\":\"430.00\",\"stock\":32,\"position\":3,\"created_at\":\"2026-08-12T22:58:51.000000Z\",\"updated_at\":\"2026-08-12T22:58:51.000000Z\"}]},\"product_id\":13,\"name\":\"Men\'s Casual Leather Sneakers\",\"slug\":\"mens-casual-leather-sneakers\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/bc71ec1a-0542-4c44-ae05-a737ce5ef16c.webp\",\"variant\":\"Size: 40\",\"price\":6000,\"unit_price\":6000,\"qty\":1,\"line_total\":6000}]', '0', NULL, '2026-08-13 16:43:19', '2026-08-13 16:43:12', '2026-08-13 16:43:19'),
('5', 'ngFjfqh4q8GmLY10igSRi3CjMLxHYM3BDmXnVCZw', 'Store Admin', '01923443872', 'admin@projoss.com', 'Lahiribari,ghatail,tangail', '1634.00', '[{\"key\":\"7|Color: White\",\"product\":{\"id\":7,\"category_id\":10,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"sku\":\"SZ-465E60\",\"brand\":\"SoundHub\",\"short_description\":\"Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace.\",\"description\":\"The Wireless Earbuds Pro by SoundHub is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"2990.00\",\"sale_price\":\"1499.00\",\"stock_quantity\":62,\"unit\":\"1 unit\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":true,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.50\",\"reviews_count\":2,\"meta_title\":\"Wireless Earbuds Pro - SoundHub | Buy Online at Projoss\",\"meta_description\":\"Buy Wireless Earbuds Pro by SoundHub at Shopzy marketplace. Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"wireless earbuds pro, soundhub, phones, buy wireless earbuds pro online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-13T15:59:29.000000Z\",\"images\":[{\"id\":140,\"product_id\":7,\"path\":\"uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"alt\":\"Wireless Earbuds Pro\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}],\"variants\":[{\"id\":71,\"product_id\":7,\"type\":\"Color\",\"value\":\"White\",\"price_delta\":\"0.00\",\"stock\":20,\"position\":0,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"},{\"id\":72,\"product_id\":7,\"type\":\"Color\",\"value\":\"Black\",\"price_delta\":\"100.00\",\"stock\":36,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}]},\"product_id\":7,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"variant\":\"Color: White\",\"price\":1499,\"unit_price\":1499,\"qty\":1,\"line_total\":1499}]', '1', NULL, '2026-08-13 17:28:01', '2026-08-13 17:25:57', '2026-08-13 17:28:49'),
('6', '88n92kQuBleGgbuyWFKX3FRKYGZsIK53yoncBzRg', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', NULL, '6410.00', '[{\"key\":\"30|Weight: 10kg\",\"product\":{\"id\":30,\"category_id\":7,\"name\":\"Dumbbell Set 10kg Pair\",\"slug\":\"dumbbell-set-10kg-pair\",\"sku\":\"SZ-1EFE00\",\"brand\":\"FitZone\",\"short_description\":\"Shop Dumbbell Set 10kg Pair from our Sports collection - authentic products at Shopzy marketplace.\",\"description\":\"The Dumbbell Set 10kg Pair by FitZone is a top pick in our Sports category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Sports collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"4500.00\",\"sale_price\":\"3990.00\",\"stock_quantity\":40,\"unit\":\"1 pair\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":false,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.70\",\"reviews_count\":190,\"meta_title\":\"Dumbbell Set 10kg Pair - FitZone | Buy Online at Shopzy\",\"meta_description\":\"Buy Dumbbell Set 10kg Pair by FitZone at Shopzy marketplace. Shop Dumbbell Set 10kg Pair from our Sports collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"dumbbell set 10kg pair, fitzone, sports, buy dumbbell set 10kg pair online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:12.000000Z\",\"updated_at\":\"2026-08-12T22:52:27.000000Z\",\"images\":[{\"id\":135,\"product_id\":30,\"path\":\"uploads\\/products\\/4bff53e3-ad1c-42f2-afda-cb5aa7c07aa5.jpeg\",\"alt\":\"Dumbbell Set 10kg Pair\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:52:27.000000Z\",\"updated_at\":\"2026-08-12T22:52:27.000000Z\"},{\"id\":136,\"product_id\":30,\"path\":\"uploads\\/products\\/064d2493-6888-4e77-83a8-5e57f0f17c67.jpeg\",\"alt\":\"Dumbbell Set 10kg Pair\",\"is_primary\":false,\"position\":2,\"created_at\":\"2026-08-12T22:52:28.000000Z\",\"updated_at\":\"2026-08-12T22:52:28.000000Z\"}],\"variants\":[{\"id\":66,\"product_id\":30,\"type\":\"Weight\",\"value\":\"10kg\",\"price_delta\":\"2000.00\",\"stock\":19,\"position\":0,\"created_at\":\"2026-08-12T22:52:28.000000Z\",\"updated_at\":\"2026-08-12T22:52:28.000000Z\"}]},\"product_id\":30,\"name\":\"Dumbbell Set 10kg Pair\",\"slug\":\"dumbbell-set-10kg-pair\",\"image\":\"http:\\/\\/127.0.0.1:8006\\/uploads\\/products\\/4bff53e3-ad1c-42f2-afda-cb5aa7c07aa5.jpeg\",\"variant\":\"Weight: 10kg\",\"price\":5990,\"unit_price\":5990,\"qty\":1,\"line_total\":5990}]', '0', NULL, '2026-08-14 17:49:18', '2026-08-14 17:49:11', '2026-08-14 17:49:18'),
('7', 'AXVvd6ThsTOkE9iLBYaRhtWuj4mQhWAHsk1LctTt', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', NULL, '10560.00', '[{\"key\":\"33|\",\"product\":{\"id\":33,\"category_id\":10,\"name\":\"Take Projoss Website Design Service\",\"slug\":\"take-projoss-website-design-service\",\"sku\":null,\"brand\":null,\"short_description\":\"Build &  Grow with\\r\\nWebsites That Drive Sales\\r\\nWe craft standout websites for every business and individual. Whether you\'re a startup or a big company, our fresh solutions make you shine online.\",\"description\":\"Website Care Made Easy\\r\\nLet us take care of your website. Experience seamless management and expert solutions.\\r\\n\\r\\nAdSense Approval\\r\\nAdSense Approval\\r\\nGet AdSense Approval on Your New Domain (100% Guaranteed Success).\\r\\n\\r\\nBook Now\\r\\nWebsite Speed\\r\\nWebsite Speed\\r\\nWe Will Optimize Your Website Speed For Better Score & Ranking In Google\\r\\n\\r\\nBook Now\\r\\nAdSense & SEO Optimized\\r\\nAdSense & SEO Optimized\\r\\nAdSense & SEO Optimized Blog Setup Using GeneratePress Premium\\r\\n\\r\\nBook Now\\r\\nOn Page SEO\\r\\nOn Page SEO\\r\\nWe Will Fix The On Page SEO Errors To Get Better Ranking In Google Search\\r\\n\\r\\nBook Now\\r\\nDesign Issues\\r\\nDesign Issues\\r\\nWe Will Fix Any Design Issues and Enhance Your WordPress Website.\\r\\n\\r\\nBook Now\\r\\nBusiness Email\\r\\nBusiness Email\\r\\nWe Will Create Professional Business Email Like: [email protected]\\r\\n\\r\\nBook Now\\r\\nMigrate Your Website\\r\\nMigrate Your Website\\r\\nWe Will Seamlessly Migrate Your Website To The New Hosting Environment.\\r\\n\\r\\nBook Now\\r\\nGoogle Search Console\\r\\nGoogle Search Console\\r\\nWe Will Fix Google Search Console Issues To Achieve Better Ranking Results.\\r\\n\\r\\nBook Now\",\"specifications\":[],\"regular_price\":\"10000.00\",\"sale_price\":null,\"stock_quantity\":50,\"unit\":null,\"is_published\":true,\"is_featured\":false,\"is_new_arrival\":false,\"is_best_seller\":false,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"0.00\",\"reviews_count\":0,\"meta_title\":null,\"meta_description\":null,\"meta_keywords\":null,\"created_at\":\"2026-08-14T19:01:05.000000Z\",\"updated_at\":\"2026-08-14T19:01:05.000000Z\",\"images\":[{\"id\":147,\"product_id\":33,\"path\":\"uploads\\/products\\/37c129de-c30e-4ca6-92b5-57440f755466.png\",\"alt\":\"Take Projoss Website Design Service\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-14T19:01:05.000000Z\",\"updated_at\":\"2026-08-14T19:01:05.000000Z\"}],\"variants\":[]},\"product_id\":33,\"name\":\"Take Projoss Website Design Service\",\"slug\":\"take-projoss-website-design-service\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/37c129de-c30e-4ca6-92b5-57440f755466.png\",\"variant\":null,\"price\":10000,\"unit_price\":10000,\"qty\":1,\"line_total\":10000}]', '0', NULL, '2026-08-14 20:05:57', '2026-08-14 19:07:27', '2026-08-14 20:05:57'),
('8', 'Lh6oR3jsx5KvosX3CjvvkNrpnaxedqBYXiBx2J6d', 'S.M Sabuj media', '01923443872', NULL, 'Lahiribari,ghatail,tangail', '1634.00', '[{\"key\":\"7|Color: White\",\"product\":{\"id\":7,\"category_id\":10,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"sku\":\"SZ-465E60\",\"brand\":\"SoundHub\",\"short_description\":\"Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace.\",\"description\":\"The Wireless Earbuds Pro by SoundHub is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"2990.00\",\"sale_price\":\"1499.00\",\"stock_quantity\":61,\"unit\":\"1 unit\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":true,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.50\",\"reviews_count\":2,\"meta_title\":\"Wireless Earbuds Pro - SoundHub | Buy Online at Projoss\",\"meta_description\":\"Buy Wireless Earbuds Pro by SoundHub at Shopzy marketplace. Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"wireless earbuds pro, soundhub, phones, buy wireless earbuds pro online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-13T17:28:03.000000Z\",\"images\":[{\"id\":140,\"product_id\":7,\"path\":\"uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"alt\":\"Wireless Earbuds Pro\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}],\"variants\":[{\"id\":71,\"product_id\":7,\"type\":\"Color\",\"value\":\"White\",\"price_delta\":\"0.00\",\"stock\":20,\"position\":0,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"},{\"id\":72,\"product_id\":7,\"type\":\"Color\",\"value\":\"Black\",\"price_delta\":\"100.00\",\"stock\":36,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}]},\"product_id\":7,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"variant\":\"Color: White\",\"price\":1499,\"unit_price\":1499,\"qty\":1,\"line_total\":1499}]', '0', NULL, '2026-08-14 19:59:05', '2026-08-14 19:59:05', '2026-08-14 19:59:05'),
('9', 'GAgfTD0JWemTgO8iHwgBtw84tMjeQpQPq6y4osEX', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', NULL, '1634.00', '[{\"key\":\"7|Color: White\",\"product\":{\"id\":7,\"category_id\":10,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"sku\":\"SZ-465E60\",\"brand\":\"SoundHub\",\"short_description\":\"Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace.\",\"description\":\"The Wireless Earbuds Pro by SoundHub is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"2990.00\",\"sale_price\":\"1499.00\",\"stock_quantity\":58,\"unit\":\"1 unit\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":true,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.50\",\"reviews_count\":2,\"meta_title\":\"Wireless Earbuds Pro - SoundHub | Buy Online at Projoss\",\"meta_description\":\"Buy Wireless Earbuds Pro by SoundHub at Shopzy marketplace. Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"wireless earbuds pro, soundhub, phones, buy wireless earbuds pro online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-14T20:00:17.000000Z\",\"images\":[{\"id\":140,\"product_id\":7,\"path\":\"uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"alt\":\"Wireless Earbuds Pro\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}],\"variants\":[{\"id\":71,\"product_id\":7,\"type\":\"Color\",\"value\":\"White\",\"price_delta\":\"0.00\",\"stock\":20,\"position\":0,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"},{\"id\":72,\"product_id\":7,\"type\":\"Color\",\"value\":\"Black\",\"price_delta\":\"100.00\",\"stock\":36,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}]},\"product_id\":7,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"variant\":\"Color: White\",\"price\":1499,\"unit_price\":1499,\"qty\":1,\"line_total\":1499}]', '0', NULL, '2026-08-14 20:09:32', '2026-08-14 20:09:32', '2026-08-14 20:09:32'),
('10', 'FOj9rRGJ8lXws8GKj9T3z0OFBQ7UvGy6Wl29DNo4', 'Store Admin', '01923443872', 'admin@projoss.com', 'Ghatail,Tangail', '1634.00', '[{\"key\":\"7|Color: White\",\"product\":{\"id\":7,\"category_id\":10,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"sku\":\"SZ-465E60\",\"brand\":\"SoundHub\",\"short_description\":\"Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace.\",\"description\":\"The Wireless Earbuds Pro by SoundHub is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\\r\\n\\r\\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\\r\\n\\r\\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\\r\\n\\r\\nWarranty and care instructions follow the brand guidelines included with your order.\",\"specifications\":[],\"regular_price\":\"2990.00\",\"sale_price\":\"1499.00\",\"stock_quantity\":61,\"unit\":\"1 unit\",\"is_published\":true,\"is_featured\":true,\"is_new_arrival\":true,\"is_best_seller\":true,\"is_flash_sale\":false,\"flash_sale_position\":0,\"flash_sale_progress\":50,\"rating\":\"4.50\",\"reviews_count\":2,\"meta_title\":\"Wireless Earbuds Pro - SoundHub | Buy Online at Projoss\",\"meta_description\":\"Buy Wireless Earbuds Pro by SoundHub at Shopzy marketplace. Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.\",\"meta_keywords\":\"wireless earbuds pro, soundhub, phones, buy wireless earbuds pro online, shopzy, bangladesh marketplace\",\"created_at\":\"2026-08-02T03:28:11.000000Z\",\"updated_at\":\"2026-08-14T20:14:05.000000Z\",\"images\":[{\"id\":140,\"product_id\":7,\"path\":\"uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"alt\":\"Wireless Earbuds Pro\",\"is_primary\":true,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}],\"variants\":[{\"id\":71,\"product_id\":7,\"type\":\"Color\",\"value\":\"White\",\"price_delta\":\"0.00\",\"stock\":20,\"position\":0,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"},{\"id\":72,\"product_id\":7,\"type\":\"Color\",\"value\":\"Black\",\"price_delta\":\"100.00\",\"stock\":36,\"position\":1,\"created_at\":\"2026-08-12T22:56:18.000000Z\",\"updated_at\":\"2026-08-12T22:56:18.000000Z\"}]},\"product_id\":7,\"name\":\"Wireless Earbuds Pro\",\"slug\":\"wireless-earbuds-pro\",\"image\":\"http:\\/\\/127.0.0.1:8000\\/uploads\\/products\\/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp\",\"variant\":\"Color: White\",\"price\":1499,\"unit_price\":1499,\"qty\":1,\"line_total\":1499}]', '0', NULL, '2026-08-14 20:35:13', '2026-08-14 20:34:46', '2026-08-14 20:35:13');

INSERT INTO `banners` (`id`, `title`, `subtitle`, `badge`, `image`, `link_url`, `button_text`, `placement`, `style`, `position`, `is_active`, `created_at`, `updated_at`) VALUES
('1', 'Up to 70% off everything', 'Millions of products. Free shipping vouchers. New deals every hour.', '11.11 SALE', 'uploads/banners/ff237e70-9ee2-4b45-9d8b-b903b6d1bfee.webp', '/shop', 'Shop now', 'hero', 'brand', '0', '1', '2026-08-02 03:28:11', '2026-08-12 20:46:11'),
('2', 'Latest gadgets, lowest prices', 'Genuine brands with warranty. Pay on delivery.', 'NEW TECH', 'uploads/banners/7e03de8f-1f70-49cc-b444-70639abc770b.png', '/shop?flash=1', 'Explore', 'hero', 'brand', '1', '1', '2026-08-02 03:28:11', '2026-08-12 21:37:28'),
('6', NULL, NULL, NULL, 'uploads/banners/5ad0f583-5207-4c94-8eb9-2233ff5ba137.jpeg', NULL, NULL, 'middle', 'brand', '0', '1', '2026-08-12 21:38:47', '2026-08-12 21:38:47');

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('projoss-cache-app_settings_bag', 'a:98:{s:9:\"site_name\";s:7:\"Projoss\";s:7:\"tagline\";s:32:\"Your everyday online marketplace\";s:4:\"logo\";s:57:\"uploads/branding/c1cb8752-f66a-4efe-9a7c-937be9fc8589.png\";s:7:\"favicon\";s:0:\"\";s:11:\"footer_text\";s:112:\"Your everyday online marketplace - millions of products, flash deals and vouchers, delivered across the country.\";s:13:\"contact_phone\";s:15:\"+880 1700-15042\";s:15:\"whatsapp_number\";s:14:\"+8801923443872\";s:14:\"messenger_page\";s:10:\"sabuj.page\";s:13:\"contact_email\";s:19:\"support@projoss.com\";s:15:\"contact_address\";s:22:\"Dhaka 1207, Bangladesh\";s:13:\"contact_hours\";s:18:\"Sat-Thu, 9am - 9pm\";s:13:\"contact_title\";s:12:\"Get in touch\";s:13:\"contact_intro\";s:36:\"We usually reply within a few hours.\";s:18:\"search_placeholder\";s:20:\"Search in Projoss...\";s:12:\"facebook_url\";s:21:\"https://facebook.com/\";s:13:\"instagram_url\";s:22:\"https://instagram.com/\";s:11:\"twitter_url\";s:20:\"https://twitter.com/\";s:12:\"bkash_number\";s:11:\"01700000000\";s:12:\"nagad_number\";s:11:\"01800000000\";s:13:\"rocket_number\";s:11:\"01900000000\";s:15:\"pay_cod_enabled\";s:1:\"1\";s:17:\"pay_bkash_enabled\";s:1:\"1\";s:17:\"pay_nagad_enabled\";s:1:\"1\";s:18:\"pay_rocket_enabled\";s:1:\"1\";s:20:\"show_cards_in_footer\";s:1:\"0\";s:21:\"shipping_inside_dhaka\";s:2:\"60\";s:22:\"shipping_outside_dhaka\";s:3:\"120\";s:11:\"tax_percent\";s:1:\"5\";s:21:\"shipping_inside_label\";s:12:\"Inside Dhaka\";s:22:\"shipping_outside_label\";s:13:\"Outside Dhaka\";s:15:\"currency_symbol\";s:3:\"৳\";s:13:\"currency_code\";s:3:\"BDT\";s:18:\"default_meta_title\";s:36:\"Projoss- Online Shopping Marketplace\";s:24:\"default_meta_description\";s:111:\"Projoss - flash deals, vouchers and millions of products. Fast delivery and Cash on Delivery across Bangladesh.\";s:21:\"default_meta_keywords\";s:71:\"Projoss, marketplace, online shopping, flash sale, vouchers, bangladesh\";s:15:\"tracking_gtm_id\";s:0:\"\";s:15:\"tracking_ga4_id\";s:0:\"\";s:22:\"tracking_meta_pixel_id\";s:14:\"45654645645646\";s:11:\"otp_enabled\";s:1:\"1\";s:19:\"show_brands_marquee\";s:1:\"1\";s:14:\"brands_marquee\";s:39:\"Volt, Pixel, Nimbus, Aero, Quanta, Core\";s:17:\"header_promo_text\";s:33:\"📱 Save more on the Projoss app\";s:17:\"header_promo_link\";s:5:\"/shop\";s:13:\"shop_subtitle\";s:76:\"Browse electronics, fashion, home & living and more - flash deals every day.\";s:18:\"flash_sale_ends_at\";s:19:\"2026-08-14 10:28:00\";s:12:\"deal_ends_at\";s:19:\"2026-08-07 10:28:00\";s:17:\"delivery_eta_text\";s:30:\"Estimated delivery in 2-3 days\";s:18:\"homepage_tab_count\";s:1:\"8\";s:21:\"home_categories_title\";s:10:\"Categories\";s:19:\"home_hot_deal_title\";s:10:\"Flash Sale\";s:19:\"home_featured_title\";s:12:\"Just For You\";s:20:\"home_deal_week_title\";s:15:\"Latest Products\";s:15:\"home_tabs_title\";s:12:\"Best Sellers\";s:17:\"home_brands_label\";s:21:\"Official brand stores\";s:20:\"home_view_more_label\";s:8:\"View all\";s:16:\"default_cta_text\";s:9:\"ORDER NOW\";s:18:\"product_cta_action\";s:8:\"checkout\";s:19:\"hero_fallback_badge\";s:10:\"11.11 SALE\";s:19:\"hero_fallback_title\";s:24:\"Up to 70% off everything\";s:22:\"hero_fallback_subtitle\";s:67:\"Millions of products. Free shipping vouchers. New deals every hour.\";s:13:\"terms_content\";s:6:\"drgtdf\";s:15:\"privacy_content\";s:7:\"rdsgtrt\";s:11:\"mail_mailer\";s:4:\"smtp\";s:9:\"mail_host\";s:0:\"\";s:9:\"mail_port\";s:3:\"587\";s:13:\"mail_username\";s:0:\"\";s:13:\"mail_password\";s:0:\"\";s:15:\"mail_encryption\";s:3:\"tls\";s:17:\"mail_from_address\";s:20:\"no-reply@projoss.com\";s:14:\"mail_from_name\";s:7:\"Projoss\";s:30:\"landing_design_chilora_visible\";s:1:\"1\";s:29:\"landing_design_nuraya_visible\";s:1:\"1\";s:14:\"refund_content\";s:9:\"ghjhgjhgj\";s:15:\"courier_default\";s:9:\"steadfast\";s:17:\"steadfast_api_key\";s:32:\"ace225nojzhjklgn5xp2cbwtwbpp2bqr\";s:20:\"steadfast_secret_key\";s:24:\"t0lsbkndbcu60e6ejicmychm\";s:16:\"pathao_client_id\";s:0:\"\";s:20:\"pathao_client_secret\";s:0:\"\";s:15:\"pathao_username\";s:0:\"\";s:15:\"pathao_password\";s:0:\"\";s:15:\"pathao_store_id\";s:0:\"\";s:14:\"redx_api_token\";s:0:\"\";s:23:\"fog_ip_cooldown_minutes\";s:1:\"0\";s:26:\"fog_phone_cooldown_minutes\";s:1:\"0\";s:24:\"fog_max_orders_per_phone\";s:1:\"0\";s:30:\"fog_bdcourier_min_success_rate\";s:1:\"0\";s:31:\"fog_bdcourier_block_risk_levels\";s:11:\"danger,high\";s:11:\"fog_enabled\";s:1:\"1\";s:20:\"fog_ip_block_enabled\";s:1:\"1\";s:24:\"fog_device_block_enabled\";s:1:\"1\";s:23:\"fog_phone_block_enabled\";s:1:\"1\";s:29:\"fog_fake_number_block_enabled\";s:1:\"1\";s:27:\"fog_auto_block_ip_on_cancel\";s:1:\"0\";s:21:\"fog_bdcourier_enabled\";s:1:\"1\";s:33:\"fog_bdcourier_auto_check_checkout\";s:1:\"1\";s:21:\"fog_bdcourier_api_key\";s:60:\"Y71ajGzb2bee2ujlOZkroNp96CNzwxFlJpTJBXwlkqJZSAHB57J10b6z1qLe\";s:12:\"chat_enabled\";s:1:\"1\";s:11:\"call_number\";s:11:\"01923443872\";}', '1786801252');

INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `icon`, `image`, `description`, `position`, `is_active`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`) VALUES
('2', NULL, 'Fashion', 'fashion', '👗', 'uploads/categories/7c9364fb-6280-4ae8-9dcb-a11132fc5d03.png', 'Clothing, shoes and accessories for everyone.', '1', '1', 'Fashion - Buy Online in Bangladesh | Projoss', 'Shop Fashion at Shopzy marketplace. Clothing, shoes and accessories for everyone. Fast delivery and Cash on Delivery.', 'fashion, Fashion, online marketplace bangladesh, Shopzy', '2026-08-02 03:28:11', '2026-08-12 21:26:10'),
('4', NULL, 'Health & Beauty', 'health-beauty', '💄', 'uploads/categories/d8033e93-66e1-4218-9fe8-48a45e70adb1.png', 'Skincare, makeup and wellness products.', '3', '1', 'Health & Beauty - Buy Online in Bangladesh | projoss', 'Shop Health & Beauty at Shopzy marketplace. Skincare, makeup and wellness products. Fast delivery and Cash on Delivery.', 'health, beauty, Health & Beauty, online marketplace bangladesh, Shopzy', '2026-08-02 03:28:11', '2026-08-12 21:26:22'),
('5', NULL, 'Babies & Toys', 'babies-toys', NULL, 'uploads/categories/2612814a-16ba-48a9-a459-acff4054fb22.png', 'Toys, baby care and kids essentials.', '4', '1', 'Babies & Toys - Buy Online in Bangladesh Projoss', 'Shop Babies & Toys at Shopzy marketplace. Toys, baby care and kids essentials. Fast delivery and Cash on Delivery.', 'babies, toys, Babies & Toys, online marketplace bangladesh, Shopzy', '2026-08-02 03:28:11', '2026-08-12 21:26:57'),
('6', '7', 'Groceries', 'groceries', '🛒', 'uploads/categories/180e5763-4e87-4040-b2ee-b32d017516de.png', 'Everyday pantry and household staples.', '5', '1', 'Groceries - Buy Online in Bangladesh | Projoss', 'Shop Groceries at Shopzy marketplace. Everyday pantry and household staples. Fast delivery and Cash on Delivery.', 'groceries, Groceries, online marketplace bangladesh, Shopzy', '2026-08-02 03:28:11', '2026-08-12 21:26:36'),
('7', NULL, 'Sports', 'sports', '⚽', 'uploads/categories/264b2103-d533-49dc-a0ab-a1e02c38c73c.png', 'Sports gear, outdoor and fitness.', '6', '1', 'Sports - Buy Online in Bangladesh', 'Shop Sports at Shopzy marketplace. Sports gear, outdoor and fitness. Fast delivery and Cash on Delivery.', 'sports, Sports, online marketplace bangladesh, Shopzy', '2026-08-02 03:28:11', '2026-08-12 21:27:12'),
('10', NULL, 'Phones', 'phones', '📱', 'uploads/categories/90bc9863-fe45-4f9a-baa7-99835f4b3ebd.png', 'Smartphones and mobile accessories.', '9', '1', 'Phones - Buy Online in Bangladesh | Shopzy', 'Shop Phones at Shopzy marketplace. Smartphones and mobile accessories. Fast delivery and Cash on Delivery.', 'phones, Phones, online marketplace bangladesh, Shopzy', '2026-08-02 03:28:11', '2026-08-12 21:29:52'),
('14', NULL, 'Fodd', 'delete-me-test', NULL, 'uploads/categories/c20987ff-ec8b-4f5f-b304-f06327ec92b9.png', NULL, '0', '1', NULL, NULL, NULL, '2026-08-12 21:17:52', '2026-08-12 21:25:48'),
('15', NULL, 'Kofi', 'kofi', NULL, 'uploads/categories/0fd2bf34-1eb3-423d-a9a5-7097371c7fbc.png', NULL, '0', '1', NULL, NULL, NULL, '2026-08-12 21:34:16', '2026-08-12 21:34:16'),
('16', NULL, 'GHI', 'ghi', NULL, 'uploads/categories/49166983-d8c2-4846-bdd7-02983ee65f50.png', NULL, '0', '1', NULL, NULL, NULL, '2026-08-12 21:34:37', '2026-08-12 21:34:37');

INSERT INTO `contact_form_fields` (`id`, `key`, `label`, `type`, `placeholder`, `help_text`, `options`, `is_required`, `is_system`, `is_active`, `position`, `accept`, `max_size_kb`, `created_at`, `updated_at`) VALUES
('1', 'name', 'Full name', 'text', 'Your name', NULL, NULL, '1', '1', '1', '0', NULL, NULL, '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('2', 'email', 'Email', 'email', 'you@example.com', NULL, NULL, '1', '1', '1', '1', NULL, NULL, '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('3', 'phone', 'Phone', 'tel', '01XXX-XXXXXX', NULL, NULL, '0', '1', '1', '2', NULL, NULL, '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('4', 'subject', 'Subject', 'text', 'How can we help?', NULL, NULL, '0', '1', '1', '3', NULL, NULL, '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('5', 'message', 'Message', 'textarea', 'Write your message…', NULL, NULL, '1', '1', '1', '4', NULL, NULL, '2026-08-02 03:28:11', '2026-08-02 03:28:11');

INSERT INTO `contact_message_values` (`id`, `contact_message_id`, `field_key`, `field_label`, `field_type`, `value`, `file_path`, `file_name`, `position`, `created_at`, `updated_at`) VALUES
('1', '1', 'name', 'Full name', 'text', 'Rahim Uddin', NULL, NULL, '0', '2026-08-02 01:28:12', '2026-08-02 01:28:12'),
('2', '1', 'email', 'Email', 'email', 'rahim.uddin@example.com', NULL, NULL, '1', '2026-08-02 01:28:12', '2026-08-02 01:28:12'),
('3', '1', 'phone', 'Phone', 'tel', '01711-111111', NULL, NULL, '2', '2026-08-02 01:28:12', '2026-08-02 01:28:12'),
('4', '1', 'subject', 'Subject', 'text', 'Order delivery question', NULL, NULL, '3', '2026-08-02 01:28:12', '2026-08-02 01:28:12'),
('5', '1', 'message', 'Message', 'textarea', 'Assalamu alaikum. I placed an order yesterday and wanted to confirm the delivery timeline for outside Dhaka.', NULL, NULL, '4', '2026-08-02 01:28:12', '2026-08-02 01:28:12'),
('11', '3', 'name', 'Full name', 'text', 'Karim Mia', NULL, NULL, '0', '2026-08-01 00:28:12', '2026-08-01 00:28:12'),
('12', '3', 'email', 'Email', 'email', 'karim.mia@example.com', NULL, NULL, '1', '2026-08-01 00:28:12', '2026-08-01 00:28:12'),
('13', '3', 'phone', 'Phone', 'tel', '01933-333333', NULL, NULL, '2', '2026-08-01 00:28:12', '2026-08-01 00:28:12'),
('14', '3', 'subject', 'Subject', 'text', 'Payment verification', NULL, NULL, '3', '2026-08-01 00:28:12', '2026-08-01 00:28:12'),
('15', '3', 'message', 'Message', 'textarea', 'I paid via bKash but the order still shows pending. Txn ID: BKASHDEMO123. Please check.', NULL, NULL, '4', '2026-08-01 00:28:12', '2026-08-01 00:28:12'),
('16', '4', 'name', 'Full name', 'text', 'Nadia Islam', NULL, NULL, '0', '2026-07-30 23:28:12', '2026-07-30 23:28:12'),
('17', '4', 'email', 'Email', 'email', 'nadia.islam@example.com', NULL, NULL, '1', '2026-07-30 23:28:12', '2026-07-30 23:28:12'),
('18', '4', 'phone', 'Phone', 'tel', '01644-444444', NULL, NULL, '2', '2026-07-30 23:28:12', '2026-07-30 23:28:12'),
('19', '4', 'subject', 'Subject', 'text', 'Return / exchange', NULL, NULL, '3', '2026-07-30 23:28:12', '2026-07-30 23:28:12'),
('20', '4', 'message', 'Message', 'textarea', 'The item I received is the wrong color. Can I exchange it within 7 days?', NULL, NULL, '4', '2026-07-30 23:28:12', '2026-07-30 23:28:12'),
('21', '5', 'name', 'Full name', 'text', 'Sumon Hossain', NULL, NULL, '0', '2026-07-29 21:28:12', '2026-07-29 21:28:12'),
('22', '5', 'email', 'Email', 'email', 'sumon.hossain@example.com', NULL, NULL, '1', '2026-07-29 21:28:12', '2026-07-29 21:28:12'),
('23', '5', 'phone', 'Phone', 'tel', '01555-555555', NULL, NULL, '2', '2026-07-29 21:28:12', '2026-07-29 21:28:12'),
('24', '5', 'subject', 'Subject', 'text', 'Wholesale inquiry', NULL, NULL, '3', '2026-07-29 21:28:12', '2026-07-29 21:28:12'),
('25', '5', 'message', 'Message', 'textarea', 'We run a small shop and would like bulk pricing for 50+ units. Please share your wholesale process.', NULL, NULL, '4', '2026-07-29 21:28:12', '2026-07-29 21:28:12'),
('26', '6', 'name', 'Full name', 'text', 'Tanvir Ahmed', NULL, NULL, '0', '2026-07-26 02:28:12', '2026-07-26 02:28:12'),
('27', '6', 'email', 'Email', 'email', 'tanvir.ahmed@example.com', NULL, NULL, '1', '2026-07-26 02:28:12', '2026-07-26 02:28:12'),
('28', '6', 'phone', 'Phone', 'tel', '01366-666666', NULL, NULL, '2', '2026-07-26 02:28:12', '2026-07-26 02:28:12'),
('29', '6', 'subject', 'Subject', 'text', 'Thanks for the help', NULL, NULL, '3', '2026-07-26 02:28:12', '2026-07-26 02:28:12'),
('30', '6', 'message', 'Message', 'textarea', 'Support resolved my shipping issue quickly. Thank you — keeping this for the record.', NULL, NULL, '4', '2026-07-26 02:28:12', '2026-07-26 02:28:12'),
('31', '7', 'name', 'Full name', 'text', 'Farzana Begum', NULL, NULL, '0', '2026-07-22 19:28:12', '2026-07-22 19:28:12'),
('32', '7', 'email', 'Email', 'email', 'farzana.begum@example.com', NULL, NULL, '1', '2026-07-22 19:28:12', '2026-07-22 19:28:12'),
('33', '7', 'phone', 'Phone', 'tel', '01777-777777', NULL, NULL, '2', '2026-07-22 19:28:12', '2026-07-22 19:28:12'),
('34', '7', 'subject', 'Subject', 'text', 'Website feedback', NULL, NULL, '3', '2026-07-22 19:28:12', '2026-07-22 19:28:12'),
('35', '7', 'message', 'Message', 'textarea', 'Checkout was smooth on mobile. One suggestion: show estimated delivery dates more clearly.', NULL, NULL, '4', '2026-07-22 19:28:12', '2026-07-22 19:28:12');

INSERT INTO `contact_messages` (`id`, `status`, `name`, `email`, `phone`, `subject`, `ip_address`, `user_agent`, `read_at`, `created_at`, `updated_at`) VALUES
('1', 'read', 'Rahim Uddin', 'rahim.uddin@example.com', '01711-111111', 'Order delivery question', '127.0.0.1', 'SeedBot/1.0', '2026-08-12 20:17:27', '2026-08-02 01:28:12', '2026-08-12 20:17:27'),
('3', 'read', 'Karim Mia', 'karim.mia@example.com', '01933-333333', 'Payment verification', '127.0.0.1', 'SeedBot/1.0', '2026-08-12 23:10:02', '2026-08-01 00:28:12', '2026-08-12 23:10:02'),
('4', 'read', 'Nadia Islam', 'nadia.islam@example.com', '01644-444444', 'Return / exchange', '127.0.0.1', 'SeedBot/1.0', '2026-07-31 01:28:12', '2026-07-30 23:28:12', '2026-07-31 01:28:12'),
('5', 'read', 'Sumon Hossain', 'sumon.hossain@example.com', '01555-555555', 'Wholesale inquiry', '127.0.0.1', 'SeedBot/1.0', '2026-07-29 23:28:12', '2026-07-29 21:28:12', '2026-07-29 23:28:12'),
('6', 'archived', 'Tanvir Ahmed', 'tanvir.ahmed@example.com', '01366-666666', 'Thanks for the help', '127.0.0.1', 'SeedBot/1.0', '2026-07-26 04:28:12', '2026-07-26 02:28:12', '2026-07-26 04:28:12'),
('7', 'archived', 'Farzana Begum', 'farzana.begum@example.com', '01777-777777', 'Website feedback', '127.0.0.1', 'SeedBot/1.0', '2026-07-22 21:28:12', '2026-07-22 19:28:12', '2026-07-22 21:28:12');

INSERT INTO `coupons` (`id`, `code`, `description`, `type`, `value`, `min_order_amount`, `max_discount`, `max_uses`, `used_count`, `starts_at`, `expires_at`, `is_active`, `created_at`, `updated_at`) VALUES
('1', 'SAVE10', '10% off orders over ৳1,000', 'percentage', '10.00', '1000.00', '500.00', '100', '0', NULL, '2027-02-02 02:28:11', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('2', 'FLAT200', '৳200 off orders over ৳2,000', 'fixed', '200.00', '2000.00', NULL, '50', '0', NULL, '2026-11-02 02:28:11', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('3', 'WELCOME', '15% welcome discount for new shoppers', 'percentage', '15.00', '500.00', '800.00', NULL, '0', NULL, NULL, '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11');

INSERT INTO `features` (`id`, `icon`, `title`, `subtitle`, `position`, `is_active`, `created_at`, `updated_at`) VALUES
('1', 'M3 7h11v8H3zM14 10h4l3 3v2h-7', 'Free Delivery', 'Orders over ৳2,000', '0', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('2', 'M3 3h2l2 12h11l2-8H7', '৳500 Vouchers', 'Collect & save', '1', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('3', 'M3 12a9 9 0 1 0 9-9 M3 5v4h4', 'Easy Returns', '7-day policy', '2', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('4', 'M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7z', 'Projoss Mall', '100% authentic brands', '3', '1', '2026-08-02 03:28:11', '2026-08-12 21:03:32');

INSERT INTO `landing_pages` (`id`, `title`, `slug`, `design`, `product_id`, `is_active`, `content`, `created_at`, `updated_at`) VALUES
('13', 'Projoss X1 landing', 'projoss-x1-landing', 'chilora', '30', '1', '{\"brand\":\"Projoss Shop\",\"phone\":\"01600-000000\",\"whatsapp\":\"8801600000000\",\"warranty\":\"\\u09ec \\u09ae\\u09be\\u09b8\\u09c7\\u09b0 \\u0993\\u09af\\u09bc\\u09be\\u09b0\\u09c7\\u09a8\\u09cd\\u099f\\u09bf\",\"promo_left\":\"\\u0995\\u09cd\\u09af\\u09be\\u09b6 \\u0985\\u09a8 \\u09a1\\u09c7\\u09b2\\u09bf\\u09ad\\u09be\\u09b0\\u09bf \\u09b8\\u09be\\u09b0\\u09be \\u09a6\\u09c7\\u09b6\\u09c7\",\"meta_title\":\"Chilora \\u2014 \\u099f\\u0995\\u09bf\\u0982 \\u09b2\\u09be\\u09b0\\u09cd\\u09a8\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 + \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u0995\\u09bf\\u099f\",\"meta_description\":\"\\u09b0\\u09bf\\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09c7\\u09ac\\u09b2 \\u099f\\u0995\\u09bf\\u0982 \\u09b2\\u09be\\u09b0\\u09cd\\u09a8\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 \\u2014 \\u0995\\u09cd\\u09af\\u09be\\u09b6 \\u0985\\u09a8 \\u09a1\\u09c7\\u09b2\\u09bf\\u09ad\\u09be\\u09b0\\u09bf\\u0964\",\"hero_badge\":\"\\u0986\\u09a6\\u09b0\\u09cd\\u09b6 \\u09ae\\u09be-\\u09ac\\u09be\\u09ac\\u09be\\u09b0 \\u09b8\\u09c7\\u09b0\\u09be \\u0989\\u09aa\\u09b9\\u09be\\u09b0 ok\",\"hero_title\":\"\\u09ac\\u09be\\u099a\\u09cd\\u099a\\u09be\\u09a6\\u09c7\\u09b0 \\u09ae\\u09cb\\u09ac\\u09be\\u0987\\u09b2 \\u0986\\u09b8\\u0995\\u09cd\\u09a4\\u09bf \\u0995\\u09ae\\u09be\\u09a4\\u09c7 \\u09a6\\u09bf\\u09a8\\r\\n\\u09ae\\u09c7\\u09a7\\u09be \\u09ac\\u09bf\\u0995\\u09be\\u09b6\\u09c7\\u09b0 \\u09b8\\u09c7\\u09b0\\u09be \\u0989\\u09aa\\u09b9\\u09be\\u09b0\",\"hero_subtitle\":\"\\u09b0\\u09bf\\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09c7\\u09ac\\u09b2 \\u0987\\u09a8\\u09cd\\u099f\\u09c7\\u09b2\\u09bf\\u099c\\u09c7\\u09a8\\u09cd\\u099f \\u09ac\\u09c1\\u0995 \\u2013 \\u0986\\u09aa\\u09a1\\u09c7\\u099f\\u09c7\\u09a1 \\u09ad\\u09be\\u09b0\\u09cd\\u09b8\\u09a8! \\u09ac\\u09be\\u09b0\\u09ac\\u09be\\u09b0 \\u09ac\\u09cd\\u09af\\u09be\\u099f\\u09be\\u09b0\\u09bf \\u0995\\u09c7\\u09a8\\u09be\\u09b0 \\u099d\\u09be\\u09ae\\u09c7\\u09b2\\u09be \\u09a8\\u09c7\\u0987\\u0964 \\u09b8\\u09be\\u09a5\\u09c7 \\u09ec \\u09ae\\u09be\\u09b8\\u09c7\\u09b0 \\u0993\\u09af\\u09bc\\u09be\\u09b0\\u09c7\\u09a8\\u09cd\\u099f\\u09bf\\u0964\",\"hero_image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-kit\\/720\\/560\",\"cta_text\":\"\\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09a4\\u09c7 \\u099a\\u09be\\u0987\",\"offer_badge\":\"\\u09b8\\u09c0\\u09ae\\u09bf\\u09a4 \\u09b8\\u09ae\\u09af\\u09bc\\u09c7\\u09b0 \\u09ac\\u09bf\\u09b6\\u09c7\\u09b7 \\u0985\\u09ab\\u09be\\u09b0\",\"offer_title\":\"\\u0985\\u09ab\\u09be\\u09b0 \\u09b6\\u09c7\\u09b7 \\u09b9\\u0993\\u09af\\u09bc\\u09be\\u09b0 \\u0986\\u0997\\u09c7 \\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09c1\\u09a8\",\"offer_price\":1200,\"regular_price\":1650,\"offer_end_hours\":18,\"features_heading\":\"\\u098f\\u0995\\u099f\\u09bf \\u09ac\\u0987\\u09af\\u09bc\\u09c7\\u0987 \\u09b8\\u09ac \\u0995\\u09bf\\u099b\\u09c1\",\"features_intro\":\"\\u09ac\\u09be\\u0982\\u09b2\\u09be\\u2013\\u0987\\u0982\\u09b0\\u09c7\\u099c\\u09bf\\u2013\\u0986\\u09b0\\u09ac\\u09bf \\u09b6\\u09bf\\u0995\\u09cd\\u09b7\\u09be, \\u0987\\u09b8\\u09b2\\u09be\\u09ae\\u09bf\\u0995 \\u0995\\u09a8\\u09cd\\u099f\\u09c7\\u09a8\\u09cd\\u099f, \\u09b0\\u09c7\\u0995\\u09b0\\u09cd\\u09a1\\u09bf\\u0982 \\u0993 \\u09b2\\u09c7\\u0996\\u09be\\u09b0 \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u2014 \\u09b8\\u09ac \\u098f\\u0995\\u09b8\\u09be\\u09a5\\u09c7\\u0964\",\"features\":[{\"title\":\"Rechargeable & Hassle-Free\",\"body\":\"USB Type-C \\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09bf\\u0982 \\u2014 \\u09ac\\u09cd\\u09af\\u09be\\u099f\\u09be\\u09b0\\u09bf \\u0995\\u09c7\\u09a8\\u09be\\u09b0 \\u099d\\u09be\\u09ae\\u09c7\\u09b2\\u09be \\u09a8\\u09c7\\u0987\\u0964\"},{\"title\":\"\\u09b0\\u09c7\\u0995\\u09b0\\u09cd\\u09a1\\u09bf\\u0982 \\u09ac\\u09be\\u099f\\u09a8\",\"body\":\"\\u09b6\\u09bf\\u09b6\\u09c1 \\u09af\\u09be \\u09ac\\u09b2\\u09ac\\u09c7, \\u09ac\\u0987\\u099f\\u09bf \\u09b0\\u09bf\\u09aa\\u09bf\\u099f \\u0995\\u09b0\\u09ac\\u09c7 \\u2014 \\u09ae\\u099c\\u09be\\u09b0 \\u099b\\u09b2\\u09c7 \\u09b6\\u09c7\\u0996\\u09be\\u0964\"},{\"title\":\"\\u0987\\u09a8\\u09cd\\u099f\\u09be\\u09b0\\u09c7\\u0995\\u09cd\\u099f\\u09bf\\u09ad \\u09aa\\u09cd\\u09b0\\u09b6\\u09cd\\u09a8\\u09cb\\u09a4\\u09cd\\u09a4\\u09b0\",\"body\":\"\\u09b8\\u09cd\\u09ae\\u09c3\\u09a4\\u09bf\\u09b6\\u0995\\u09cd\\u09a4\\u09bf \\u0993 \\u09ae\\u09a8\\u09cb\\u09af\\u09cb\\u0997 \\u09ac\\u09be\\u09a1\\u09bc\\u09be\\u09af\\u09bc \\u09aa\\u09cd\\u09b0\\u09b6\\u09cd\\u09a8 \\u09ac\\u09be\\u099f\\u09a8\\u09c7\\u09b0 \\u09ae\\u09be\\u09a7\\u09cd\\u09af\\u09ae\\u09c7\\u0964\"},{\"title\":\"\\u09ea\\u09e6 \\u09aa\\u09c3\\u09b7\\u09cd\\u09a0\\u09be\\u09af\\u09bc \\u09eb\\u09e8+ \\u0995\\u09a8\\u09cd\\u099f\\u09c7\\u09a8\\u09cd\\u099f\",\"body\":\"\\u09b8\\u09ae\\u09c3\\u09a6\\u09cd\\u09a7 \\u09aa\\u09be\\u09a0\\u09cd\\u09af \\u2014 \\u098f\\u0995\\u099f\\u09bf \\u09ac\\u0987\\u09af\\u09bc\\u09c7\\u0987 \\u09b8\\u09ae\\u09cd\\u09aa\\u09c2\\u09b0\\u09cd\\u09a3 \\u09aa\\u09cd\\u09af\\u09be\\u0995\\u09c7\\u099c\\u0964\"},{\"title\":\"Male & Female Dual Voice\",\"body\":\"\\u09a6\\u09cd\\u09ac\\u09c8\\u09a4 \\u0995\\u09a3\\u09cd\\u09a0\\u09b8\\u09cd\\u09ac\\u09b0 \\u2014 \\u09b6\\u09cb\\u09a8\\u09be\\u09b0 \\u0985\\u09ad\\u09bf\\u099c\\u09cd\\u099e\\u09a4\\u09be \\u0986\\u09b0\\u0993 \\u09b8\\u09ae\\u09c3\\u09a6\\u09cd\\u09a7\\u0964\"},{\"title\":\"Book Lock System\",\"body\":\"\\u09b6\\u0995\\u09cd\\u09a4 \\u09b9\\u09cd\\u09af\\u09be\\u09a8\\u09cd\\u09a1\\u09c7\\u09b2 \\u0993 \\u09aa\\u09b0\\u09bf\\u09b7\\u09cd\\u0995\\u09be\\u09b0 \\u09b8\\u09be\\u0989\\u09a8\\u09cd\\u09a1 \\u0995\\u09cb\\u09af\\u09bc\\u09be\\u09b2\\u09bf\\u099f\\u09bf\\u0964\"}],\"why_heading\":\"\\u09b6\\u09bf\\u09b6\\u09c1\\u09b0 \\u099c\\u09a8\\u09cd\\u09af \\u09b8\\u09c7\\u09b0\\u09be \\u09ae\\u09c7\\u09a7\\u09be \\u09ac\\u09bf\\u0995\\u09be\\u09b6\\u09c7\\u09b0 \\u09b8\\u0999\\u09cd\\u0997\\u09c0\",\"benefits\":[{\"icon\":\"globe\",\"title\":\"\\u09a4\\u09bf\\u09a8 \\u09ad\\u09be\\u09b7\\u09be\\u09af\\u09bc \\u09b6\\u09bf\\u0995\\u09cd\\u09b7\\u09be\",\"body\":\"\\u09ac\\u09be\\u0982\\u09b2\\u09be, \\u0987\\u0982\\u09b0\\u09c7\\u099c\\u09bf \\u0993 \\u0986\\u09b0\\u09ac\\u09bf \\u09ac\\u09b0\\u09cd\\u09a3\\u09ae\\u09be\\u09b2\\u09be \\u0993 \\u0989\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09a3 \\u098f\\u0995\\u0987 \\u09ac\\u0987\\u09a4\\u09c7\\u0964\"},{\"icon\":\"mic\",\"title\":\"\\u0995\\u09a5\\u09be \\u09ac\\u09b2\\u09be \\u0993 \\u0989\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09a3 \\u099a\\u09b0\\u09cd\\u099a\\u09be\",\"body\":\"\\u09b8\\u09cd\\u09aa\\u09b7\\u09cd\\u099f \\u0989\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09a3 \\u0997\\u09be\\u0987\\u09a1 \\u2014 \\u09b6\\u09bf\\u09b6\\u09c1 \\u09a8\\u09bf\\u099c\\u09c7 \\u09a8\\u09bf\\u099c\\u09c7 \\u09b6\\u09bf\\u0996\\u09a4\\u09c7 \\u09aa\\u09be\\u09b0\\u09c7\\u0964\"},{\"icon\":\"palette\",\"title\":\"\\u0986\\u09a8\\u09a8\\u09cd\\u09a6\\u09ae\\u09af\\u09bc \\u09ac\\u09bf\\u09b7\\u09af\\u09bc\\u09ac\\u09b8\\u09cd\\u09a4\\u09c1\",\"body\":\"\\u09ad\\u09bf\\u099c\\u09cd\\u09af\\u09c1\\u09af\\u09bc\\u09be\\u09b2 \\u0989\\u09aa\\u09b8\\u09cd\\u09a5\\u09be\\u09aa\\u09a8\\u09be \\u09af\\u09be \\u0995\\u09cc\\u09a4\\u09c2\\u09b9\\u09b2 \\u0993 \\u09b6\\u09c7\\u0996\\u09be\\u09b0 \\u0986\\u0997\\u09cd\\u09b0\\u09b9 \\u09ac\\u09be\\u09a1\\u09bc\\u09be\\u09af\\u09bc\\u0964\"},{\"icon\":\"edit\",\"title\":\"\\u09b2\\u09c7\\u0996\\u09be \\u0993 \\u09aa\\u09a1\\u09bc\\u09be\\u09b0 \\u0985\\u09a8\\u09c1\\u09b6\\u09c0\\u09b2\\u09a8\",\"body\":\"\\u09ae\\u09be\\u09b0\\u09cd\\u0995\\u09be\\u09b0 \\u09aa\\u09c7\\u09a8 \\u09a6\\u09bf\\u09af\\u09bc\\u09c7 \\u09b9\\u09be\\u09a4\\u09c7-\\u0995\\u09b2\\u09ae\\u09c7 \\u09b6\\u09c7\\u0996\\u09be\\u09b0 \\u09ac\\u09be\\u09b8\\u09cd\\u09a4\\u09ac \\u09ae\\u099c\\u09be\\u0964\"},{\"icon\":\"shield\",\"title\":\"\\u099f\\u09c7\\u0995\\u09b8\\u0987 \\u0993 \\u09a8\\u09bf\\u09b0\\u09be\\u09aa\\u09a6 \\u09ac\\u09a1\\u09bf\",\"body\":\"\\u09aa\\u09cd\\u09b0\\u09bf\\u09ae\\u09bf\\u09af\\u09bc\\u09be\\u09ae ABS \\u09aa\\u09cd\\u09b2\\u09be\\u09b8\\u09cd\\u099f\\u09bf\\u0995 \\u09ac\\u09a1\\u09bf \\u2014 \\u09b6\\u09bf\\u09b6\\u09c1\\u09a6\\u09c7\\u09b0 \\u099c\\u09a8\\u09cd\\u09af \\u09a6\\u09c0\\u09b0\\u09cd\\u0998\\u09b8\\u09cd\\u09a5\\u09be\\u09af\\u09bc\\u09c0\\u0964\"},{\"icon\":\"battery\",\"title\":\"\\u09b0\\u09bf\\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09c7\\u09ac\\u09b2 \\u0987\\u09a8\\u09cd\\u099f\\u09c7\\u09b2\\u09bf\\u099c\\u09c7\\u09a8\\u09cd\\u099f \\u09ac\\u09c1\\u0995\",\"body\":\"\\u0986\\u09aa\\u09a1\\u09c7\\u099f\\u09c7\\u09a1 \\u09ad\\u09be\\u09b0\\u09cd\\u09b8\\u09a8 \\u2014 \\u09ac\\u09be\\u09b0\\u09ac\\u09be\\u09b0 \\u09ac\\u09cd\\u09af\\u09be\\u099f\\u09be\\u09b0\\u09bf \\u0995\\u09c7\\u09a8\\u09be\\u09b0 \\u09a6\\u09b0\\u0995\\u09be\\u09b0 \\u09a8\\u09c7\\u0987\\u0964\"}],\"reviews_heading\":\"\\u0986\\u09ae\\u09be\\u09a6\\u09c7\\u09b0 \\u09b8\\u09ae\\u09cd\\u09ae\\u09be\\u09a8\\u09bf\\u09a4 \\u0995\\u09be\\u09b8\\u09cd\\u099f\\u09ae\\u09be\\u09b0\\u09c7\\u09b0 \\u09ae\\u09a4\\u09be\\u09ae\\u09a4\",\"testimonials\":[{\"image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-r1\\/640\\/480\",\"text\":\"\\u201c\\u09ac\\u09be\\u099a\\u09cd\\u099a\\u09be \\u098f\\u0996\\u09a8 \\u09ac\\u0987 \\u09a8\\u09bf\\u09af\\u09bc\\u09c7 \\u09ae\\u09c7\\u09a4\\u09c7 \\u09a5\\u09be\\u0995\\u09c7 \\u2014 \\u09ae\\u09cb\\u09ac\\u09be\\u0987\\u09b2 \\u09a6\\u09c7\\u0996\\u09be\\u09b0 \\u0985\\u09ad\\u09cd\\u09af\\u09be\\u09b8 \\u0985\\u09a8\\u09c7\\u0995\\u099f\\u09be\\u0987 \\u0995\\u09ae\\u09c7 \\u0997\\u09c7\\u099b\\u09c7\\u0964\\u201d\"},{\"image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-r2\\/640\\/480\",\"text\":\"\\u201c\\u09b8\\u09be\\u0989\\u09a8\\u09cd\\u09a1 \\u0985\\u09a8\\u09c7\\u0995 \\u09b8\\u09cd\\u09aa\\u09b7\\u09cd\\u099f \\u098f\\u09ac\\u0982 \\u099a\\u09be\\u09b0\\u09cd\\u099c \\u0985\\u09a8\\u09c7\\u0995\\u0995\\u09cd\\u09b7\\u09a3 \\u09a5\\u09be\\u0995\\u09c7\\u0964 \\u09aa\\u09cd\\u09af\\u09be\\u0995\\u09c7\\u099c\\u09bf\\u0982 \\u09a6\\u09be\\u09b0\\u09c1\\u09a3 \\u099b\\u09bf\\u09b2\\u0964\\u201d\"},{\"image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-r3\\/640\\/480\",\"text\":\"\\u201c\\u0993\\u09af\\u09bc\\u09be\\u099f\\u09be\\u09b0 \\u09ac\\u09c1\\u0995 \\u09ab\\u09cd\\u09b0\\u09bf \\u09aa\\u09c7\\u09af\\u09bc\\u09c7 \\u09ac\\u09be\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09be \\u09ad\\u09c0\\u09b7\\u09a3 \\u0996\\u09c1\\u09b6\\u09bf \\u2014 \\u09a6\\u09c1\\u0987 \\u09ad\\u09be\\u0987\\u09ac\\u09cb\\u09a8 \\u098f\\u0995\\u09b8\\u09be\\u09a5\\u09c7 \\u0996\\u09c7\\u09b2\\u099b\\u09c7\\u0964\\u201d\"}],\"phone_cta_title\":\"\\u09ab\\u09cb\\u09a8\\u09c7 \\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09a4\\u09c7 \\u099a\\u09be\\u09a8? \\u09b8\\u09b0\\u09be\\u09b8\\u09b0\\u09bf \\u0995\\u09b2 \\u0995\\u09b0\\u09c1\\u09a8\",\"order_heading\":\"\\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09a4\\u09c7 \\u09a8\\u09bf\\u099a\\u09c7\\u09b0 \\u09ac\\u09be\\u099f\\u09a8\\u09c7 \\u0995\\u09cd\\u09b2\\u09bf\\u0995 \\u0995\\u09b0\\u09c1\\u09a8\",\"order_subtext\":\"\\u099a\\u09c7\\u0995\\u0986\\u0989\\u099f \\u09aa\\u09c7\\u099c\\u09c7 \\u0997\\u09bf\\u09af\\u09bc\\u09c7 \\u09a0\\u09bf\\u0995\\u09be\\u09a8\\u09be \\u0993 \\u09aa\\u09c7\\u09ae\\u09c7\\u09a8\\u09cd\\u099f \\u09b8\\u09ae\\u09cd\\u09aa\\u09a8\\u09cd\\u09a8 \\u0995\\u09b0\\u09c1\\u09a8\\u0964 \\u0995\\u09cd\\u09af\\u09be\\u09b6 \\u0985\\u09a8 \\u09a1\\u09c7\\u09b2\\u09bf\\u09ad\\u09be\\u09b0\\u09bf \\u0989\\u09aa\\u09b2\\u09ac\\u09cd\\u09a7\\u0964\",\"product_label\":\"Chilora \\u099f\\u0995\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 + \\u0993\\u09af\\u09bc\\u09be\\u099f\\u09be\\u09b0 \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u09ac\\u09c1\\u0995 \\u09ab\\u09cd\\u09b0\\u09bf\",\"product_thumb\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-thumb\\/120\\/120\",\"footer_blurb\":\"\\u09b6\\u09bf\\u09b6\\u09c1\\u09a6\\u09c7\\u09b0 \\u099c\\u09a8\\u09cd\\u09af \\u0986\\u09a8\\u09a8\\u09cd\\u09a6\\u09ae\\u09af\\u09bc \\u09b6\\u09bf\\u0995\\u09cd\\u09b7\\u09be\\u09b0 \\u09b8\\u0999\\u09cd\\u0997\\u09c0 \\u2014 \\u099f\\u0995\\u09bf\\u0982 \\u09b2\\u09be\\u09b0\\u09cd\\u09a8\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 \\u0993 \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u0995\\u09bf\\u099f\\u0964\",\"_sections\":{\"brand\":true,\"hero\":true,\"offer\":true,\"features\":true,\"why\":true,\"reviews\":true,\"phone_cta\":true,\"order\":true}}', '2026-08-14 19:27:11', '2026-08-14 19:48:54'),
('14', 'Projoss X1 landing', 'projoss-x1-landing-2', 'chilora', '30', '0', '{\"brand\":\"Chilora\",\"phone\":\"01600-000000\",\"whatsapp\":\"8801600000000\",\"warranty\":\"\\u09ec \\u09ae\\u09be\\u09b8\\u09c7\\u09b0 \\u0993\\u09af\\u09bc\\u09be\\u09b0\\u09c7\\u09a8\\u09cd\\u099f\\u09bf\",\"promo_left\":\"\\u0995\\u09cd\\u09af\\u09be\\u09b6 \\u0985\\u09a8 \\u09a1\\u09c7\\u09b2\\u09bf\\u09ad\\u09be\\u09b0\\u09bf \\u09b8\\u09be\\u09b0\\u09be \\u09a6\\u09c7\\u09b6\\u09c7\",\"meta_title\":\"Chilora \\u2014 \\u099f\\u0995\\u09bf\\u0982 \\u09b2\\u09be\\u09b0\\u09cd\\u09a8\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 + \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u0995\\u09bf\\u099f\",\"meta_description\":\"\\u09b0\\u09bf\\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09c7\\u09ac\\u09b2 \\u099f\\u0995\\u09bf\\u0982 \\u09b2\\u09be\\u09b0\\u09cd\\u09a8\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 \\u2014 \\u0995\\u09cd\\u09af\\u09be\\u09b6 \\u0985\\u09a8 \\u09a1\\u09c7\\u09b2\\u09bf\\u09ad\\u09be\\u09b0\\u09bf\\u0964\",\"hero_badge\":\"\\u0986\\u09a6\\u09b0\\u09cd\\u09b6 \\u09ae\\u09be-\\u09ac\\u09be\\u09ac\\u09be\\u09b0 \\u09b8\\u09c7\\u09b0\\u09be \\u0989\\u09aa\\u09b9\\u09be\\u09b0\",\"hero_title\":\"\\u09ac\\u09be\\u099a\\u09cd\\u099a\\u09be\\u09a6\\u09c7\\u09b0 \\u09ae\\u09cb\\u09ac\\u09be\\u0987\\u09b2 \\u0986\\u09b8\\u0995\\u09cd\\u09a4\\u09bf \\u0995\\u09ae\\u09be\\u09a4\\u09c7 \\u09a6\\u09bf\\u09a8\\n\\u09ae\\u09c7\\u09a7\\u09be \\u09ac\\u09bf\\u0995\\u09be\\u09b6\\u09c7\\u09b0 \\u09b8\\u09c7\\u09b0\\u09be \\u0989\\u09aa\\u09b9\\u09be\\u09b0\",\"hero_subtitle\":\"\\u09b0\\u09bf\\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09c7\\u09ac\\u09b2 \\u0987\\u09a8\\u09cd\\u099f\\u09c7\\u09b2\\u09bf\\u099c\\u09c7\\u09a8\\u09cd\\u099f \\u09ac\\u09c1\\u0995 \\u2013 \\u0986\\u09aa\\u09a1\\u09c7\\u099f\\u09c7\\u09a1 \\u09ad\\u09be\\u09b0\\u09cd\\u09b8\\u09a8! \\u09ac\\u09be\\u09b0\\u09ac\\u09be\\u09b0 \\u09ac\\u09cd\\u09af\\u09be\\u099f\\u09be\\u09b0\\u09bf \\u0995\\u09c7\\u09a8\\u09be\\u09b0 \\u099d\\u09be\\u09ae\\u09c7\\u09b2\\u09be \\u09a8\\u09c7\\u0987\\u0964 \\u09b8\\u09be\\u09a5\\u09c7 \\u09ec \\u09ae\\u09be\\u09b8\\u09c7\\u09b0 \\u0993\\u09af\\u09bc\\u09be\\u09b0\\u09c7\\u09a8\\u09cd\\u099f\\u09bf\\u0964\",\"hero_image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-kit\\/720\\/560\",\"cta_text\":\"\\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09a4\\u09c7 \\u099a\\u09be\\u0987\",\"offer_badge\":\"\\u09b8\\u09c0\\u09ae\\u09bf\\u09a4 \\u09b8\\u09ae\\u09af\\u09bc\\u09c7\\u09b0 \\u09ac\\u09bf\\u09b6\\u09c7\\u09b7 \\u0985\\u09ab\\u09be\\u09b0\",\"offer_title\":\"\\u0985\\u09ab\\u09be\\u09b0 \\u09b6\\u09c7\\u09b7 \\u09b9\\u0993\\u09af\\u09bc\\u09be\\u09b0 \\u0986\\u0997\\u09c7 \\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09c1\\u09a8\",\"offer_price\":1200,\"regular_price\":1650,\"offer_end_hours\":18,\"features_heading\":\"\\u098f\\u0995\\u099f\\u09bf \\u09ac\\u0987\\u09af\\u09bc\\u09c7\\u0987 \\u09b8\\u09ac \\u0995\\u09bf\\u099b\\u09c1\",\"features_intro\":\"\\u09ac\\u09be\\u0982\\u09b2\\u09be\\u2013\\u0987\\u0982\\u09b0\\u09c7\\u099c\\u09bf\\u2013\\u0986\\u09b0\\u09ac\\u09bf \\u09b6\\u09bf\\u0995\\u09cd\\u09b7\\u09be, \\u0987\\u09b8\\u09b2\\u09be\\u09ae\\u09bf\\u0995 \\u0995\\u09a8\\u09cd\\u099f\\u09c7\\u09a8\\u09cd\\u099f, \\u09b0\\u09c7\\u0995\\u09b0\\u09cd\\u09a1\\u09bf\\u0982 \\u0993 \\u09b2\\u09c7\\u0996\\u09be\\u09b0 \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u2014 \\u09b8\\u09ac \\u098f\\u0995\\u09b8\\u09be\\u09a5\\u09c7\\u0964\",\"features\":[{\"title\":\"Rechargeable & Hassle-Free\",\"body\":\"USB Type-C \\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09bf\\u0982 \\u2014 \\u09ac\\u09cd\\u09af\\u09be\\u099f\\u09be\\u09b0\\u09bf \\u0995\\u09c7\\u09a8\\u09be\\u09b0 \\u099d\\u09be\\u09ae\\u09c7\\u09b2\\u09be \\u09a8\\u09c7\\u0987\\u0964\"},{\"title\":\"\\u09b0\\u09c7\\u0995\\u09b0\\u09cd\\u09a1\\u09bf\\u0982 \\u09ac\\u09be\\u099f\\u09a8\",\"body\":\"\\u09b6\\u09bf\\u09b6\\u09c1 \\u09af\\u09be \\u09ac\\u09b2\\u09ac\\u09c7, \\u09ac\\u0987\\u099f\\u09bf \\u09b0\\u09bf\\u09aa\\u09bf\\u099f \\u0995\\u09b0\\u09ac\\u09c7 \\u2014 \\u09ae\\u099c\\u09be\\u09b0 \\u099b\\u09b2\\u09c7 \\u09b6\\u09c7\\u0996\\u09be\\u0964\"},{\"title\":\"\\u0987\\u09a8\\u09cd\\u099f\\u09be\\u09b0\\u09c7\\u0995\\u09cd\\u099f\\u09bf\\u09ad \\u09aa\\u09cd\\u09b0\\u09b6\\u09cd\\u09a8\\u09cb\\u09a4\\u09cd\\u09a4\\u09b0\",\"body\":\"\\u09b8\\u09cd\\u09ae\\u09c3\\u09a4\\u09bf\\u09b6\\u0995\\u09cd\\u09a4\\u09bf \\u0993 \\u09ae\\u09a8\\u09cb\\u09af\\u09cb\\u0997 \\u09ac\\u09be\\u09a1\\u09bc\\u09be\\u09af\\u09bc \\u09aa\\u09cd\\u09b0\\u09b6\\u09cd\\u09a8 \\u09ac\\u09be\\u099f\\u09a8\\u09c7\\u09b0 \\u09ae\\u09be\\u09a7\\u09cd\\u09af\\u09ae\\u09c7\\u0964\"},{\"title\":\"\\u09ea\\u09e6 \\u09aa\\u09c3\\u09b7\\u09cd\\u09a0\\u09be\\u09af\\u09bc \\u09eb\\u09e8+ \\u0995\\u09a8\\u09cd\\u099f\\u09c7\\u09a8\\u09cd\\u099f\",\"body\":\"\\u09b8\\u09ae\\u09c3\\u09a6\\u09cd\\u09a7 \\u09aa\\u09be\\u09a0\\u09cd\\u09af \\u2014 \\u098f\\u0995\\u099f\\u09bf \\u09ac\\u0987\\u09af\\u09bc\\u09c7\\u0987 \\u09b8\\u09ae\\u09cd\\u09aa\\u09c2\\u09b0\\u09cd\\u09a3 \\u09aa\\u09cd\\u09af\\u09be\\u0995\\u09c7\\u099c\\u0964\"},{\"title\":\"Male & Female Dual Voice\",\"body\":\"\\u09a6\\u09cd\\u09ac\\u09c8\\u09a4 \\u0995\\u09a3\\u09cd\\u09a0\\u09b8\\u09cd\\u09ac\\u09b0 \\u2014 \\u09b6\\u09cb\\u09a8\\u09be\\u09b0 \\u0985\\u09ad\\u09bf\\u099c\\u09cd\\u099e\\u09a4\\u09be \\u0986\\u09b0\\u0993 \\u09b8\\u09ae\\u09c3\\u09a6\\u09cd\\u09a7\\u0964\"},{\"title\":\"Book Lock System\",\"body\":\"\\u09b6\\u0995\\u09cd\\u09a4 \\u09b9\\u09cd\\u09af\\u09be\\u09a8\\u09cd\\u09a1\\u09c7\\u09b2 \\u0993 \\u09aa\\u09b0\\u09bf\\u09b7\\u09cd\\u0995\\u09be\\u09b0 \\u09b8\\u09be\\u0989\\u09a8\\u09cd\\u09a1 \\u0995\\u09cb\\u09af\\u09bc\\u09be\\u09b2\\u09bf\\u099f\\u09bf\\u0964\"}],\"why_heading\":\"\\u09b6\\u09bf\\u09b6\\u09c1\\u09b0 \\u099c\\u09a8\\u09cd\\u09af \\u09b8\\u09c7\\u09b0\\u09be \\u09ae\\u09c7\\u09a7\\u09be \\u09ac\\u09bf\\u0995\\u09be\\u09b6\\u09c7\\u09b0 \\u09b8\\u0999\\u09cd\\u0997\\u09c0\",\"benefits\":[{\"icon\":\"globe\",\"title\":\"\\u09a4\\u09bf\\u09a8 \\u09ad\\u09be\\u09b7\\u09be\\u09af\\u09bc \\u09b6\\u09bf\\u0995\\u09cd\\u09b7\\u09be\",\"body\":\"\\u09ac\\u09be\\u0982\\u09b2\\u09be, \\u0987\\u0982\\u09b0\\u09c7\\u099c\\u09bf \\u0993 \\u0986\\u09b0\\u09ac\\u09bf \\u09ac\\u09b0\\u09cd\\u09a3\\u09ae\\u09be\\u09b2\\u09be \\u0993 \\u0989\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09a3 \\u098f\\u0995\\u0987 \\u09ac\\u0987\\u09a4\\u09c7\\u0964\"},{\"icon\":\"mic\",\"title\":\"\\u0995\\u09a5\\u09be \\u09ac\\u09b2\\u09be \\u0993 \\u0989\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09a3 \\u099a\\u09b0\\u09cd\\u099a\\u09be\",\"body\":\"\\u09b8\\u09cd\\u09aa\\u09b7\\u09cd\\u099f \\u0989\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09a3 \\u0997\\u09be\\u0987\\u09a1 \\u2014 \\u09b6\\u09bf\\u09b6\\u09c1 \\u09a8\\u09bf\\u099c\\u09c7 \\u09a8\\u09bf\\u099c\\u09c7 \\u09b6\\u09bf\\u0996\\u09a4\\u09c7 \\u09aa\\u09be\\u09b0\\u09c7\\u0964\"},{\"icon\":\"palette\",\"title\":\"\\u0986\\u09a8\\u09a8\\u09cd\\u09a6\\u09ae\\u09af\\u09bc \\u09ac\\u09bf\\u09b7\\u09af\\u09bc\\u09ac\\u09b8\\u09cd\\u09a4\\u09c1\",\"body\":\"\\u09ad\\u09bf\\u099c\\u09cd\\u09af\\u09c1\\u09af\\u09bc\\u09be\\u09b2 \\u0989\\u09aa\\u09b8\\u09cd\\u09a5\\u09be\\u09aa\\u09a8\\u09be \\u09af\\u09be \\u0995\\u09cc\\u09a4\\u09c2\\u09b9\\u09b2 \\u0993 \\u09b6\\u09c7\\u0996\\u09be\\u09b0 \\u0986\\u0997\\u09cd\\u09b0\\u09b9 \\u09ac\\u09be\\u09a1\\u09bc\\u09be\\u09af\\u09bc\\u0964\"},{\"icon\":\"edit\",\"title\":\"\\u09b2\\u09c7\\u0996\\u09be \\u0993 \\u09aa\\u09a1\\u09bc\\u09be\\u09b0 \\u0985\\u09a8\\u09c1\\u09b6\\u09c0\\u09b2\\u09a8\",\"body\":\"\\u09ae\\u09be\\u09b0\\u09cd\\u0995\\u09be\\u09b0 \\u09aa\\u09c7\\u09a8 \\u09a6\\u09bf\\u09af\\u09bc\\u09c7 \\u09b9\\u09be\\u09a4\\u09c7-\\u0995\\u09b2\\u09ae\\u09c7 \\u09b6\\u09c7\\u0996\\u09be\\u09b0 \\u09ac\\u09be\\u09b8\\u09cd\\u09a4\\u09ac \\u09ae\\u099c\\u09be\\u0964\"},{\"icon\":\"shield\",\"title\":\"\\u099f\\u09c7\\u0995\\u09b8\\u0987 \\u0993 \\u09a8\\u09bf\\u09b0\\u09be\\u09aa\\u09a6 \\u09ac\\u09a1\\u09bf\",\"body\":\"\\u09aa\\u09cd\\u09b0\\u09bf\\u09ae\\u09bf\\u09af\\u09bc\\u09be\\u09ae ABS \\u09aa\\u09cd\\u09b2\\u09be\\u09b8\\u09cd\\u099f\\u09bf\\u0995 \\u09ac\\u09a1\\u09bf \\u2014 \\u09b6\\u09bf\\u09b6\\u09c1\\u09a6\\u09c7\\u09b0 \\u099c\\u09a8\\u09cd\\u09af \\u09a6\\u09c0\\u09b0\\u09cd\\u0998\\u09b8\\u09cd\\u09a5\\u09be\\u09af\\u09bc\\u09c0\\u0964\"},{\"icon\":\"battery\",\"title\":\"\\u09b0\\u09bf\\u099a\\u09be\\u09b0\\u09cd\\u099c\\u09c7\\u09ac\\u09b2 \\u0987\\u09a8\\u09cd\\u099f\\u09c7\\u09b2\\u09bf\\u099c\\u09c7\\u09a8\\u09cd\\u099f \\u09ac\\u09c1\\u0995\",\"body\":\"\\u0986\\u09aa\\u09a1\\u09c7\\u099f\\u09c7\\u09a1 \\u09ad\\u09be\\u09b0\\u09cd\\u09b8\\u09a8 \\u2014 \\u09ac\\u09be\\u09b0\\u09ac\\u09be\\u09b0 \\u09ac\\u09cd\\u09af\\u09be\\u099f\\u09be\\u09b0\\u09bf \\u0995\\u09c7\\u09a8\\u09be\\u09b0 \\u09a6\\u09b0\\u0995\\u09be\\u09b0 \\u09a8\\u09c7\\u0987\\u0964\"}],\"reviews_heading\":\"\\u0986\\u09ae\\u09be\\u09a6\\u09c7\\u09b0 \\u09b8\\u09ae\\u09cd\\u09ae\\u09be\\u09a8\\u09bf\\u09a4 \\u0995\\u09be\\u09b8\\u09cd\\u099f\\u09ae\\u09be\\u09b0\\u09c7\\u09b0 \\u09ae\\u09a4\\u09be\\u09ae\\u09a4\",\"testimonials\":[{\"image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-r1\\/640\\/480\",\"text\":\"\\u201c\\u09ac\\u09be\\u099a\\u09cd\\u099a\\u09be \\u098f\\u0996\\u09a8 \\u09ac\\u0987 \\u09a8\\u09bf\\u09af\\u09bc\\u09c7 \\u09ae\\u09c7\\u09a4\\u09c7 \\u09a5\\u09be\\u0995\\u09c7 \\u2014 \\u09ae\\u09cb\\u09ac\\u09be\\u0987\\u09b2 \\u09a6\\u09c7\\u0996\\u09be\\u09b0 \\u0985\\u09ad\\u09cd\\u09af\\u09be\\u09b8 \\u0985\\u09a8\\u09c7\\u0995\\u099f\\u09be\\u0987 \\u0995\\u09ae\\u09c7 \\u0997\\u09c7\\u099b\\u09c7\\u0964\\u201d\"},{\"image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-r2\\/640\\/480\",\"text\":\"\\u201c\\u09b8\\u09be\\u0989\\u09a8\\u09cd\\u09a1 \\u0985\\u09a8\\u09c7\\u0995 \\u09b8\\u09cd\\u09aa\\u09b7\\u09cd\\u099f \\u098f\\u09ac\\u0982 \\u099a\\u09be\\u09b0\\u09cd\\u099c \\u0985\\u09a8\\u09c7\\u0995\\u0995\\u09cd\\u09b7\\u09a3 \\u09a5\\u09be\\u0995\\u09c7\\u0964 \\u09aa\\u09cd\\u09af\\u09be\\u0995\\u09c7\\u099c\\u09bf\\u0982 \\u09a6\\u09be\\u09b0\\u09c1\\u09a3 \\u099b\\u09bf\\u09b2\\u0964\\u201d\"},{\"image\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-r3\\/640\\/480\",\"text\":\"\\u201c\\u0993\\u09af\\u09bc\\u09be\\u099f\\u09be\\u09b0 \\u09ac\\u09c1\\u0995 \\u09ab\\u09cd\\u09b0\\u09bf \\u09aa\\u09c7\\u09af\\u09bc\\u09c7 \\u09ac\\u09be\\u099a\\u09cd\\u099a\\u09be\\u09b0\\u09be \\u09ad\\u09c0\\u09b7\\u09a3 \\u0996\\u09c1\\u09b6\\u09bf \\u2014 \\u09a6\\u09c1\\u0987 \\u09ad\\u09be\\u0987\\u09ac\\u09cb\\u09a8 \\u098f\\u0995\\u09b8\\u09be\\u09a5\\u09c7 \\u0996\\u09c7\\u09b2\\u099b\\u09c7\\u0964\\u201d\"}],\"phone_cta_title\":\"\\u09ab\\u09cb\\u09a8\\u09c7 \\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09a4\\u09c7 \\u099a\\u09be\\u09a8? \\u09b8\\u09b0\\u09be\\u09b8\\u09b0\\u09bf \\u0995\\u09b2 \\u0995\\u09b0\\u09c1\\u09a8\",\"order_heading\":\"\\u0985\\u09b0\\u09cd\\u09a1\\u09be\\u09b0 \\u0995\\u09b0\\u09a4\\u09c7 \\u09a8\\u09bf\\u099a\\u09c7\\u09b0 \\u09ac\\u09be\\u099f\\u09a8\\u09c7 \\u0995\\u09cd\\u09b2\\u09bf\\u0995 \\u0995\\u09b0\\u09c1\\u09a8\",\"order_subtext\":\"\\u099a\\u09c7\\u0995\\u0986\\u0989\\u099f \\u09aa\\u09c7\\u099c\\u09c7 \\u0997\\u09bf\\u09af\\u09bc\\u09c7 \\u09a0\\u09bf\\u0995\\u09be\\u09a8\\u09be \\u0993 \\u09aa\\u09c7\\u09ae\\u09c7\\u09a8\\u09cd\\u099f \\u09b8\\u09ae\\u09cd\\u09aa\\u09a8\\u09cd\\u09a8 \\u0995\\u09b0\\u09c1\\u09a8\\u0964 \\u0995\\u09cd\\u09af\\u09be\\u09b6 \\u0985\\u09a8 \\u09a1\\u09c7\\u09b2\\u09bf\\u09ad\\u09be\\u09b0\\u09bf \\u0989\\u09aa\\u09b2\\u09ac\\u09cd\\u09a7\\u0964\",\"product_label\":\"Chilora \\u099f\\u0995\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 + \\u0993\\u09af\\u09bc\\u09be\\u099f\\u09be\\u09b0 \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u09ac\\u09c1\\u0995 \\u09ab\\u09cd\\u09b0\\u09bf\",\"product_thumb\":\"https:\\/\\/picsum.photos\\/seed\\/chilora-thumb\\/120\\/120\",\"footer_blurb\":\"\\u09b6\\u09bf\\u09b6\\u09c1\\u09a6\\u09c7\\u09b0 \\u099c\\u09a8\\u09cd\\u09af \\u0986\\u09a8\\u09a8\\u09cd\\u09a6\\u09ae\\u09af\\u09bc \\u09b6\\u09bf\\u0995\\u09cd\\u09b7\\u09be\\u09b0 \\u09b8\\u0999\\u09cd\\u0997\\u09c0 \\u2014 \\u099f\\u0995\\u09bf\\u0982 \\u09b2\\u09be\\u09b0\\u09cd\\u09a8\\u09bf\\u0982 \\u09ac\\u09c1\\u0995 \\u0993 \\u09aa\\u09cd\\u09b0\\u09cd\\u09af\\u09be\\u0995\\u099f\\u09bf\\u09b8 \\u0995\\u09bf\\u099f\\u0964\",\"_sections\":{\"brand\":true,\"hero\":true,\"offer\":true,\"features\":true,\"why\":true,\"reviews\":true,\"phone_cta\":true,\"order\":true}}', '2026-08-14 20:38:13', '2026-08-14 20:38:13');

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
('1', '0001_01_01_000000_create_users_table', '1'),
('2', '0001_01_01_000001_create_cache_table', '1'),
('3', '0001_01_01_000002_create_jobs_table', '1'),
('4', '2026_01_01_000010_create_categories_table', '1'),
('5', '2026_01_01_000020_create_products_table', '1'),
('6', '2026_01_01_000030_create_product_images_table', '1'),
('7', '2026_01_01_000040_create_product_variants_table', '1'),
('8', '2026_01_01_000050_create_banners_table', '1'),
('9', '2026_01_01_000060_create_features_table', '1'),
('10', '2026_01_01_000070_create_orders_table', '1'),
('11', '2026_01_01_000080_create_order_items_table', '1'),
('12', '2026_01_01_000090_create_settings_table', '1'),
('13', '2026_01_02_000010_add_profile_fields_to_users', '1'),
('14', '2026_01_02_000020_create_email_otps_table', '1'),
('15', '2026_01_03_000010_create_coupons_table', '1'),
('16', '2026_01_03_000020_add_coupon_fields_to_orders_table', '1'),
('17', '2026_07_02_000100_add_style_to_banners_table', '1'),
('18', '2026_07_13_000010_add_flash_sale_to_products_table', '1'),
('19', '2026_07_13_000020_add_flash_sale_progress_to_products_table', '1'),
('20', '2026_07_13_000030_create_product_reviews_table', '1'),
('21', '2026_07_17_000010_add_specifications_to_products_table', '1'),
('22', '2026_07_24_000010_create_contact_form_tables', '1'),
('23', '2026_07_31_000010_create_landing_pages_table', '1'),
('24', '2026_08_12_230840_create_abandoned_checkouts_table', '2'),
('25', '2026_08_12_232954_add_admin_note_to_abandoned_checkouts_table', '3'),
('26', '2026_08_12_234053_add_courier_fields_to_orders_table', '4'),
('27', '2026_08_13_003544_add_ip_and_user_agent_to_orders_table', '5'),
('28', '2026_08_13_003544_create_blocked_ips_table', '5'),
('29', '2026_08_13_100000_create_blocked_devices_table', '6'),
('30', '2026_08_13_100001_create_blocked_phones_table', '6'),
('31', '2026_08_13_100002_add_device_hash_to_orders_table', '6');

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `image`, `variant`, `unit_price`, `quantity`, `line_total`, `created_at`, `updated_at`) VALUES
('1', '1', '30', 'Dumbbell Set 10kg Pair', 'https://picsum.photos/seed/bp-dumbbell-set-10kg-pair-1/800/800', 'Weight: 10kg', '3990.00', '1', '3990.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('2', '2', '6', 'Redmi Note 13 Pro', 'https://picsum.photos/seed/bp-redmi-note-13-pro-1/800/800', 'Color: Black', '28900.00', '1', '28900.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('3', '2', NULL, 'Memory Foam Pillow Set', 'https://picsum.photos/seed/bp-memory-foam-pillow-set-1/800/800', 'Size: Standard', '3900.00', '3', '11700.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('4', '2', NULL, 'Smart Band Fitness Tracker', 'https://picsum.photos/seed/bp-smart-band-fitness-tracker-1/800/800', 'Color: Black', '2500.00', '2', '5000.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('5', '3', NULL, 'Bluetooth Speaker Waterproof', 'https://picsum.photos/seed/bp-bluetooth-speaker-waterproof-1/800/800', 'Color: Black', '1990.00', '3', '5970.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('6', '3', NULL, 'Cotton Oversized Tee Pack', 'https://picsum.photos/seed/bp-cotton-oversized-tee-pack-1/800/800', 'Size: M', '1290.00', '2', '2580.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('7', '3', '32', 'Resistance Band Set', 'https://picsum.photos/seed/bp-resistance-band-set-1/800/800', 'Level: Light', '1190.00', '3', '3570.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('8', '4', '7', 'Wireless Earbuds Pro', 'https://picsum.photos/seed/bp-wireless-earbuds-pro-1/800/800', 'Color: White', '1499.00', '3', '4497.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('9', '4', NULL, 'Polarized Aviator Sunglasses UV400', 'https://picsum.photos/seed/bp-polarized-aviator-sunglasses-uv400-1/800/800', 'Color: Gold', '2500.00', '3', '7500.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('10', '5', '6', 'Redmi Note 13 Pro', 'https://picsum.photos/seed/bp-redmi-note-13-pro-1/800/800', 'Color: Black', '28900.00', '1', '28900.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('11', '5', NULL, 'Memory Foam Pillow Set', 'https://picsum.photos/seed/bp-memory-foam-pillow-set-1/800/800', 'Size: Standard', '3900.00', '3', '11700.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('12', '5', '30', 'Dumbbell Set 10kg Pair', 'https://picsum.photos/seed/bp-dumbbell-set-10kg-pair-1/800/800', 'Weight: 10kg', '3990.00', '3', '11970.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('13', '6', '14', 'Designer Travel Backpack Waterproof', 'https://picsum.photos/seed/bp-designer-travel-backpack-waterproof-1/800/800', 'Color: Black', '4800.00', '3', '14400.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('14', '7', '25', 'Vitamin C Serum 30ml', 'https://picsum.photos/seed/bp-vitamin-c-serum-30ml-1/800/800', 'Size: 30ml', '1290.00', '1', '1290.00', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('15', '8', NULL, 'Hair Dryer Ionic Compact', 'https://picsum.photos/seed/bp-hair-dryer-ionic-compact-1/800/800', 'Color: Pink', '2790.00', '3', '8370.00', '2026-08-12 18:23:01', '2026-08-12 18:23:01'),
('16', '9', '28', 'Face Mask Sheet Pack 10', 'https://picsum.photos/seed/bp-face-mask-sheet-pack-10-1/800/800', NULL, '650.00', '1', '650.00', '2026-08-12 18:48:44', '2026-08-12 18:48:44'),
('17', '10', '28', 'Face Mask Sheet Pack 10', 'https://picsum.photos/seed/bp-face-mask-sheet-pack-10-1/800/800', NULL, '650.00', '1', '650.00', '2026-08-12 20:50:16', '2026-08-12 20:50:16'),
('18', '11', '5', 'Galaxy A55 5G 256GB', 'uploads/products/e095cc45-9ad8-4e07-980e-41184932cd80.jpg', 'Color: Awesome Navy', '47900.00', '1', '47900.00', '2026-08-12 23:10:48', '2026-08-12 23:10:48'),
('19', '12', '28', 'Face Mask Sheet Pack 10', 'uploads/products/44bbf796-0498-48ad-8f3e-0a89d4001e31.jpeg', 'Size: X, Color: test, Weight: 10', '650.00', '1', '650.00', '2026-08-12 23:16:42', '2026-08-12 23:16:42'),
('20', '13', '6', 'Redmi Note 13 Pro', 'https://picsum.photos/seed/bp-redmi-note-13-pro-1/800/800', 'Color: Black', '28900.00', '1', '28900.00', '2026-08-13 00:27:06', '2026-08-13 00:27:06'),
('21', '14', '7', 'Wireless Earbuds Pro', 'uploads/products/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp', 'Color: White', '1499.00', '1', '1499.00', '2026-08-13 00:51:03', '2026-08-13 00:51:03'),
('22', '15', '7', 'Wireless Earbuds Pro', 'uploads/products/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp', 'Color: White', '1499.00', '1', '1499.00', '2026-08-13 15:59:29', '2026-08-13 15:59:29'),
('23', '16', '5', 'Galaxy A55 5G 256GB', 'uploads/products/e095cc45-9ad8-4e07-980e-41184932cd80.jpg', 'Color: Awesome Navy', '47900.00', '1', '47900.00', '2026-08-13 17:26:11', '2026-08-13 17:26:11'),
('24', '17', '7', 'Wireless Earbuds Pro', 'uploads/products/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp', 'Color: White', '1499.00', '1', '1499.00', '2026-08-13 17:28:03', '2026-08-13 17:28:03'),
('28', '20', '7', 'Wireless Earbuds Pro', 'uploads/products/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp', 'Color: White', '1499.00', '1', '1499.00', '2026-08-14 20:35:17', '2026-08-14 20:35:17');

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `customer_name`, `customer_phone`, `customer_email`, `shipping_address`, `city`, `postal_code`, `shipping_zone`, `coupon_id`, `coupon_code`, `subtotal`, `discount_amount`, `shipping_charge`, `tax`, `total`, `payment_method`, `payment_sender_number`, `payment_txn_id`, `payment_status`, `ip_address`, `user_agent`, `device_hash`, `status`, `courier_provider`, `courier_tracking_code`, `courier_consignment_id`, `courier_status`, `internal_note`, `created_at`, `updated_at`) VALUES
('1', 'ORD-260802-XNZZ', NULL, 'Rahim Uddin', '01711-111111', 'rahim@example.com', 'House 12, Road 5, Dhanmondi', 'Dhaka', '8073', 'inside_dhaka', NULL, NULL, '3990.00', '0.00', '60.00', '200.00', '4250.00', 'bkash', '01711-111111', 'IO57SIZPHY', 'verified', NULL, NULL, NULL, 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-08-01 20:28:12', '2026-08-12 23:51:16'),
('2', 'ORD-260801-A8HW', NULL, 'Karim Mia', '01822-222222', 'karim@example.com', 'Flat 4B, Kazir Dewri', 'Chattogram', '8626', 'outside_dhaka', NULL, NULL, '45600.00', '0.00', '120.00', '2280.00', '48000.00', 'nagad', '01822-222222', 'RZ4FOCMUM6', 'pending', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, '2026-07-31 22:28:12', '2026-08-02 03:28:12'),
('3', 'ORD-260731-O9X2', NULL, 'Ayesha Akter', '01933-333333', 'ayesha@example.com', 'House 30, Uttara Sector 7', 'Dhaka', '3121', 'inside_dhaka', NULL, NULL, '12120.00', '0.00', '60.00', '606.00', '12786.00', 'bkash', '01933-333333', 'UDDOU1WWEV', 'verified', NULL, NULL, NULL, 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-07-30 17:28:12', '2026-08-02 03:28:12'),
('4', 'ORD-260730-KUZM', NULL, 'Sumon Hossain', '01644-444444', 'sumon@example.com', 'Zindabazar Main Road', 'Sylhet', '4349', 'outside_dhaka', NULL, NULL, '11997.00', '0.00', '120.00', '600.00', '12717.00', 'rocket', '01644-444444', '6P3DF6DMKL', 'verified', NULL, NULL, NULL, 'processing', NULL, NULL, NULL, NULL, NULL, '2026-07-29 20:28:12', '2026-08-02 03:28:12'),
('5', 'ORD-260729-DX1C', NULL, 'Nadia Islam', '01555-555555', 'nadia@example.com', 'House 9, Mehedibag', 'Dhaka', '5083', 'inside_dhaka', NULL, NULL, '52570.00', '0.00', '60.00', '2629.00', '55259.00', 'cod', NULL, NULL, 'verified', NULL, NULL, NULL, 'shipped', NULL, NULL, NULL, NULL, NULL, '2026-07-28 18:28:12', '2026-08-02 03:28:12'),
('6', 'ORD-260728-CAHP', NULL, 'Tanvir Ahmed', '01366-666666', 'tanvir@example.com', 'College Road', 'Rajshahi', '8962', 'outside_dhaka', NULL, NULL, '14400.00', '0.00', '120.00', '720.00', '15240.00', 'nagad', '01366-666666', 'FJFDVH1NKX', 'verified', NULL, NULL, NULL, 'delivered', NULL, NULL, NULL, NULL, NULL, '2026-07-27 23:28:12', '2026-08-02 03:28:12'),
('7', 'ORD-260727-SFNS', NULL, 'Rahim Uddin', '01711-111111', 'rahim@example.com', 'House 12, Road 5, Dhanmondi', 'Dhaka', '6101', 'inside_dhaka', NULL, NULL, '1290.00', '0.00', '60.00', '65.00', '1415.00', 'bkash', '01711-111111', '9MLXVXYIHH', 'rejected', NULL, NULL, NULL, 'cancelled', NULL, NULL, NULL, NULL, NULL, '2026-07-26 23:28:12', '2026-08-02 03:28:12'),
('8', 'ORD-260812-SAJR', NULL, 'Test User', '01711111111', NULL, 'Dhaka', 'Dhaka', NULL, 'inside_dhaka', NULL, NULL, '8370.00', '0.00', '60.00', '418.50', '8848.50', 'cod', NULL, NULL, 'verified', NULL, NULL, NULL, 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-08-12 18:23:01', '2026-08-12 18:23:01'),
('9', 'ORD-260812-L1ZX', NULL, 'test order', '0192343872', NULL, 'ghvghgh', 'Dhaka', NULL, 'outside_dhaka', NULL, NULL, '650.00', '0.00', '120.00', '32.50', '802.50', 'cod', NULL, NULL, 'verified', NULL, NULL, NULL, 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-08-12 18:48:44', '2026-08-12 18:48:44'),
('10', 'ORD-260812-PHMS', '1', 'Store Admin', 'szdf', NULL, 'sdfgdsg', 'Dhaka', NULL, 'inside_dhaka', NULL, NULL, '650.00', '0.00', '60.00', '32.50', '742.50', 'cod', NULL, NULL, 'verified', NULL, NULL, NULL, 'shipped', NULL, NULL, NULL, NULL, NULL, '2026-08-12 20:50:16', '2026-08-12 20:58:56'),
('11', 'ORD-260812-BSWM', '1', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', 'fghfgh', 'dfgdfg', NULL, 'inside_dhaka', NULL, NULL, '47900.00', '0.00', '60.00', '2395.00', '50355.00', 'cod', NULL, NULL, 'verified', NULL, NULL, NULL, 'delivered', NULL, NULL, NULL, NULL, NULL, '2026-08-12 23:10:48', '2026-08-13 16:05:50'),
('12', 'ORD-260812-ZXPB', '1', 'Store Admin', '+880 1700-000000', 'admin@projoss.com', 'bhjk', 'jkjk', NULL, 'inside_dhaka', NULL, NULL, '650.00', '0.00', '60.00', '32.50', '742.50', 'cod', NULL, NULL, 'verified', NULL, NULL, NULL, 'delivered', NULL, NULL, NULL, NULL, NULL, '2026-08-12 23:16:42', '2026-08-12 23:21:44'),
('13', 'ORD-260813-MEME', NULL, 'Md Sabuj', '01923443872', NULL, 'Village: Lahiribar, Post Office: Khupibari', 'Tangail', NULL, 'outside_dhaka', NULL, NULL, '28900.00', '0.00', '120.00', '1445.00', '30465.00', 'cod', NULL, NULL, 'pending', NULL, NULL, NULL, 'pending', NULL, NULL, NULL, NULL, NULL, '2026-08-13 00:27:06', '2026-08-13 00:27:06'),
('14', 'ORD-260813-CAPN', NULL, 'Md Sabuj', '01923443872', NULL, 'Village: Lahiribar, Post Office: Khupibari', 'Tangail', NULL, 'inside_dhaka', NULL, NULL, '1499.00', '0.00', '60.00', '74.95', '1633.95', 'cod', NULL, NULL, 'verified', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', NULL, 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-08-13 00:51:03', '2026-08-13 15:40:14'),
('15', 'ORD-260813-5LII', '1', 'Store Admin', '01923443872', 'admin@projoss.com', 'Village: Lahiribar, Post Office: Khupibari', 'Tangail', NULL, 'inside_dhaka', NULL, NULL, '1499.00', '0.00', '60.00', '74.95', '1633.95', 'cod', NULL, NULL, 'pending', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'd37ac4d248088c642487523ab0069fc279dfd865d6e23d3a430fdb98f5e8cb9f', 'pending', NULL, NULL, NULL, NULL, NULL, '2026-08-13 15:59:29', '2026-08-13 15:59:29'),
('16', 'ORD-260813-O0BD', '1', 'Store Admin', '01313156409', 'admin@projoss.com', 'Lahiribari,ghatail,tangail', 'tangail', NULL, 'inside_dhaka', NULL, NULL, '47900.00', '0.00', '60.00', '2395.00', '50355.00', 'cod', NULL, NULL, 'verified', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'd37ac4d248088c642487523ab0069fc279dfd865d6e23d3a430fdb98f5e8cb9f', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-08-13 17:26:11', '2026-08-13 17:26:38'),
('17', 'ORD-260813-GOZC', '1', 'Store Admin', '01923443872', 'admin@projoss.com', 'Lahiribari,ghatail,tangail', 'tangail', NULL, 'inside_dhaka', NULL, NULL, '1499.00', '0.00', '60.00', '74.95', '1633.95', 'cod', NULL, NULL, 'verified', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'd37ac4d248088c642487523ab0069fc279dfd865d6e23d3a430fdb98f5e8cb9f', 'confirmed', NULL, NULL, NULL, NULL, NULL, '2026-08-13 17:28:03', '2026-08-13 17:28:14'),
('20', 'ORD-260814-H7C6', '1', 'Store Admin', '01923443872', 'admin@projoss.com', 'Ghatail,Tangail', 'Dhaka', NULL, 'inside_dhaka', NULL, NULL, '1499.00', '0.00', '60.00', '74.95', '1633.95', 'cod', NULL, NULL, 'verified', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'd37ac4d248088c642487523ab0069fc279dfd865d6e23d3a430fdb98f5e8cb9f', 'shipped', NULL, NULL, NULL, NULL, NULL, '2026-08-14 20:35:17', '2026-08-14 20:36:54');

INSERT INTO `product_images` (`id`, `product_id`, `path`, `alt`, `is_primary`, `position`, `created_at`, `updated_at`) VALUES
('21', '6', 'https://picsum.photos/seed/bp-redmi-note-13-pro-1/800/800', 'Redmi Note 13 Pro - Xiaomi view 1', '1', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('22', '6', 'https://picsum.photos/seed/bp-redmi-note-13-pro-2/800/800', 'Redmi Note 13 Pro - Xiaomi view 2', '0', '2', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('23', '6', 'https://picsum.photos/seed/bp-redmi-note-13-pro-3/800/800', 'Redmi Note 13 Pro - Xiaomi view 3', '0', '3', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('24', '6', 'https://picsum.photos/seed/bp-redmi-note-13-pro-4/800/800', 'Redmi Note 13 Pro - Xiaomi view 4', '0', '4', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('29', '8', 'https://picsum.photos/seed/bp-phone-case-magsafe-clear-1/800/800', 'Phone Case MagSafe Clear - Core view 1', '1', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('30', '8', 'https://picsum.photos/seed/bp-phone-case-magsafe-clear-2/800/800', 'Phone Case MagSafe Clear - Core view 2', '0', '2', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('31', '8', 'https://picsum.photos/seed/bp-phone-case-magsafe-clear-3/800/800', 'Phone Case MagSafe Clear - Core view 3', '0', '3', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('32', '8', 'https://picsum.photos/seed/bp-phone-case-magsafe-clear-4/800/800', 'Phone Case MagSafe Clear - Core view 4', '0', '4', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('130', '28', 'uploads/products/44bbf796-0498-48ad-8f3e-0a89d4001e31.jpeg', 'Face Mask Sheet Pack 10', '1', '1', '2026-08-12 22:51:30', '2026-08-12 22:51:30'),
('131', '28', 'uploads/products/94049a47-9ff6-4e66-8673-d93361564664.jpeg', 'Face Mask Sheet Pack 10', '0', '2', '2026-08-12 22:51:31', '2026-08-12 22:51:31'),
('135', '30', 'uploads/products/4bff53e3-ad1c-42f2-afda-cb5aa7c07aa5.jpeg', 'Dumbbell Set 10kg Pair', '1', '1', '2026-08-12 22:52:27', '2026-08-12 22:52:27'),
('136', '30', 'uploads/products/064d2493-6888-4e77-83a8-5e57f0f17c67.jpeg', 'Dumbbell Set 10kg Pair', '0', '2', '2026-08-12 22:52:28', '2026-08-12 22:52:28'),
('137', '31', 'uploads/products/1305a412-7805-40f9-b467-4955bff265e3.webp', 'Sports Water Bottle 750ml', '1', '1', '2026-08-12 22:53:06', '2026-08-12 22:53:06'),
('138', '32', 'uploads/products/aad03996-6af5-4467-bcb9-66554fff54f1.jpeg', 'Resistance Band Set', '1', '1', '2026-08-12 22:54:22', '2026-08-12 22:54:22'),
('139', '32', 'uploads/products/835d4082-e63d-46c5-8950-fd64f561dcd5.jpeg', 'Resistance Band Set', '0', '2', '2026-08-12 22:54:23', '2026-08-12 22:54:23'),
('140', '7', 'uploads/products/9953512d-ccb2-4f1a-ae51-f3b889fbfa9c.webp', 'Wireless Earbuds Pro', '1', '1', '2026-08-12 22:56:18', '2026-08-12 22:56:18'),
('141', '25', 'uploads/products/d9ee319c-f99b-4719-882d-bc445ccc65fb.png', 'Vitamin C Serum 30ml', '1', '1', '2026-08-12 22:56:57', '2026-08-12 22:56:57'),
('142', '5', 'uploads/products/e095cc45-9ad8-4e07-980e-41184932cd80.jpg', 'Galaxy A55 5G 256GB', '1', '1', '2026-08-12 22:57:45', '2026-08-12 22:57:45'),
('143', '13', 'uploads/products/bc71ec1a-0542-4c44-ae05-a737ce5ef16c.webp', 'Men\'s Casual Leather Sneakers', '1', '1', '2026-08-12 22:58:51', '2026-08-12 22:58:51'),
('144', '26', 'uploads/products/9e080f37-f60a-4e43-a23d-90707f1a0039.webp', 'Electric Toothbrush Kit', '1', '1', '2026-08-12 22:59:46', '2026-08-12 22:59:46'),
('145', '14', 'uploads/products/25e4cf66-757d-4063-9dc2-06d21e588db2.png', 'Gawa Ghee 1kg', '1', '1', '2026-08-12 23:01:42', '2026-08-12 23:01:42'),
('146', '14', 'uploads/products/bb334e5f-2896-4a97-bdad-5e250930a608.png', 'Gawa Ghee 1kg', '0', '2', '2026-08-12 23:01:42', '2026-08-12 23:01:42'),
('147', '33', 'uploads/products/37c129de-c30e-4ca6-92b5-57440f755466.png', 'Take Projoss Website Design Service', '1', '1', '2026-08-14 19:01:05', '2026-08-14 19:01:05');

INSERT INTO `product_reviews` (`id`, `product_id`, `user_id`, `author_name`, `author_email`, `rating`, `title`, `body`, `status`, `is_verified_purchase`, `approved_at`, `created_at`, `updated_at`) VALUES
('15', '5', NULL, 'Sumon Hossain', 'sumon@example.com', '4', 'Happy with purchase', 'Works as expected. Customer support was helpful when I asked about size.', 'approved', '0', '2026-07-20 03:28:12', '2026-07-20 03:28:12', '2026-08-02 03:28:12'),
('16', '5', NULL, 'Tanvir Ahmed', 'tanvir@example.com', '5', 'Perfect', 'Premium feel and authentic brand. COD was convenient.', 'approved', '1', '2026-07-31 03:28:12', '2026-07-25 03:28:12', '2026-08-02 03:28:12'),
('17', '5', NULL, 'Rahim Uddin', 'rahim@example.com', '5', 'Excellent quality', 'Exactly as described. Fast delivery and well packed. Highly recommended.', 'approved', '1', '2026-07-19 03:28:12', '2026-07-14 03:28:12', '2026-08-02 03:28:12'),
('18', '5', NULL, 'Ayesha Akter', 'ayesha@example.com', '4', 'Good value', 'Solid product for the price. Packaging was neat and delivery was on time.', 'approved', '0', '2026-07-16 03:28:12', '2026-07-31 03:28:12', '2026-08-02 03:28:12'),
('19', '6', NULL, 'Tanvir Ahmed', 'tanvir@example.com', '5', 'Perfect', 'Premium feel and authentic brand. COD was convenient.', 'approved', '0', '2026-07-27 03:28:12', '2026-07-23 03:28:12', '2026-08-02 03:28:12'),
('20', '6', NULL, 'Rahim Uddin', 'rahim@example.com', '5', 'Excellent quality', 'Exactly as described. Fast delivery and well packed. Highly recommended.', 'approved', '0', '2026-07-29 03:28:12', '2026-07-10 03:28:12', '2026-08-02 03:28:12'),
('21', '6', NULL, 'Ayesha Akter', 'ayesha@example.com', '4', 'Good value', 'Solid product for the price. Packaging was neat and delivery was on time.', 'approved', '0', '2026-07-28 03:28:12', '2026-07-21 03:28:12', '2026-08-02 03:28:12'),
('22', '6', NULL, 'Karim Mia', 'karim@example.com', '5', 'Loved it', 'Great store experience. Will order again from Shopzy.', 'approved', '0', '2026-07-27 03:28:12', '2026-07-15 03:28:12', '2026-08-02 03:28:12'),
('23', '7', NULL, 'Rahim Uddin', 'rahim@example.com', '5', 'Excellent quality', 'Exactly as described. Fast delivery and well packed. Highly recommended.', 'approved', '0', '2026-07-29 03:28:12', '2026-07-13 03:28:12', '2026-08-02 03:28:12'),
('24', '7', NULL, 'Ayesha Akter', 'ayesha@example.com', '4', 'Good value', 'Solid product for the price. Packaging was neat and delivery was on time.', 'approved', '1', '2026-07-22 03:28:12', '2026-07-16 03:28:12', '2026-08-02 03:28:12'),
('26', '8', NULL, 'Karim Mia', 'karim@example.com', '5', 'Loved it', 'Great store experience. Will order again from Shopzy.', 'approved', '0', '2026-07-23 03:28:12', '2026-07-03 03:28:12', '2026-08-02 03:28:12'),
('27', '8', NULL, 'Nadia Islam', 'nadia@example.com', '3', 'Okay overall', 'Product is fine but shipping took a bit longer than expected.', 'approved', '0', '2026-07-31 03:28:12', '2026-07-07 03:28:12', '2026-08-02 03:28:12');

INSERT INTO `product_variants` (`id`, `product_id`, `type`, `value`, `price_delta`, `stock`, `position`, `created_at`, `updated_at`) VALUES
('9', '6', 'Color', 'Black', '0.00', '34', '0', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('10', '6', 'Color', 'Green', '100.00', '24', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('13', '8', 'Color', 'Clear', '0.00', '28', '0', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('14', '8', 'Color', 'Smoke', '100.00', '42', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('66', '30', 'Weight', '10kg', '2000.00', '19', '0', '2026-08-12 22:52:28', '2026-08-12 22:52:28'),
('69', '31', 'Color', 'Green', '0.00', '23', '0', '2026-08-12 22:53:33', '2026-08-12 22:53:33'),
('70', '31', 'Color', 'Black', '100.00', '10', '1', '2026-08-12 22:53:33', '2026-08-12 22:53:33'),
('71', '7', 'Color', 'White', '0.00', '20', '0', '2026-08-12 22:56:18', '2026-08-12 22:56:18'),
('72', '7', 'Color', 'Black', '100.00', '36', '1', '2026-08-12 22:56:18', '2026-08-12 22:56:18'),
('73', '25', 'Size', '30ml', '15.00', '23', '0', '2026-08-12 22:56:57', '2026-08-12 22:56:57'),
('74', '5', 'Color', 'Awesome Navy', '0.00', '45', '0', '2026-08-12 22:57:45', '2026-08-12 22:57:45'),
('75', '5', 'Color', 'Lilac', '100.00', '31', '1', '2026-08-12 22:57:45', '2026-08-12 22:57:45'),
('76', '13', 'Size', '40', '400.00', '31', '0', '2026-08-12 22:58:51', '2026-08-12 22:58:51'),
('77', '13', 'Size', '41', '410.00', '29', '1', '2026-08-12 22:58:51', '2026-08-12 22:58:51'),
('78', '13', 'Size', '42', '420.00', '28', '2', '2026-08-12 22:58:51', '2026-08-12 22:58:51'),
('79', '13', 'Size', '43', '430.00', '32', '3', '2026-08-12 22:58:51', '2026-08-12 22:58:51'),
('80', '26', 'Color', 'White', '0.00', '5', '0', '2026-08-12 22:59:46', '2026-08-12 22:59:46'),
('83', '14', 'Color', 'Black', '0.00', '34', '0', '2026-08-12 23:01:42', '2026-08-12 23:01:42'),
('84', '14', 'Color', 'Grey', '150.00', '50', '1', '2026-08-12 23:01:42', '2026-08-12 23:01:42'),
('85', '28', 'Size', 'L', '0.00', '0', '0', '2026-08-12 23:16:19', '2026-08-12 23:16:19'),
('86', '28', 'Size', 'X', '0.00', '0', '1', '2026-08-12 23:16:19', '2026-08-12 23:16:19'),
('87', '28', 'Color', 'test', '0.00', '0', '2', '2026-08-12 23:16:19', '2026-08-12 23:16:19'),
('88', '28', 'Weight', '10', '0.00', '0', '3', '2026-08-12 23:16:19', '2026-08-12 23:16:19'),
('89', '28', 'Weight', '29', '0.00', '0', '4', '2026-08-12 23:16:19', '2026-08-12 23:16:19');

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `sku`, `brand`, `short_description`, `description`, `specifications`, `regular_price`, `sale_price`, `stock_quantity`, `unit`, `is_published`, `is_featured`, `is_new_arrival`, `is_best_seller`, `is_flash_sale`, `flash_sale_position`, `flash_sale_progress`, `rating`, `reviews_count`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`) VALUES
('5', '10', 'Galaxy A55 5G 256GB', 'galaxy-a55-5g-256gb', 'SZ-FBEF4F', 'Samsung', 'Shop Galaxy A55 5G 256GB from our Phones collection - authentic products at Shopzy marketplace.', 'The Galaxy A55 5G 256GB by Samsung is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '52000.00', '47900.00', '110', '1 unit', '1', '1', '1', '1', '1', '4', '36', '4.50', '4', 'Galaxy A55 5G 256GB - Samsung | Buy Online at Shopzy', 'Buy Galaxy A55 5G 256GB by Samsung at Shopzy marketplace. Shop Galaxy A55 5G 256GB from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'galaxy a55 5g 256gb, samsung, phones, buy galaxy a55 5g 256gb online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-14 20:13:39'),
('6', '10', 'Redmi Note 13 Pro', 'redmi-note-13-pro', 'SZ-9FD677', 'Xiaomi', 'Shop Redmi Note 13 Pro from our Phones collection - authentic products at Shopzy marketplace.', 'The Redmi Note 13 Pro by Xiaomi is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\n\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\n\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\n\nWarranty and care instructions follow the brand guidelines included with your order.', NULL, '32000.00', '28900.00', '126', '1 unit', '1', '1', '0', '1', '0', '0', '50', '4.75', '4', 'Redmi Note 13 Pro - Xiaomi | Buy Online at Shopzy', 'Buy Redmi Note 13 Pro by Xiaomi at Shopzy marketplace. Shop Redmi Note 13 Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'redmi note 13 pro, xiaomi, phones, buy redmi note 13 pro online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-13 00:27:06'),
('7', '10', 'Wireless Earbuds Pro', 'wireless-earbuds-pro', 'SZ-465E60', 'SoundHub', 'Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace.', 'The Wireless Earbuds Pro by SoundHub is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '2990.00', '1499.00', '60', '1 unit', '1', '1', '1', '1', '0', '0', '50', '4.50', '2', 'Wireless Earbuds Pro - SoundHub | Buy Online at Projoss', 'Buy Wireless Earbuds Pro by SoundHub at Shopzy marketplace. Shop Wireless Earbuds Pro from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'wireless earbuds pro, soundhub, phones, buy wireless earbuds pro online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-14 20:35:17'),
('8', '10', 'Phone Case MagSafe Clear', 'phone-case-magsafe-clear', 'SZ-B4CA38', 'Core', 'Shop Phone Case MagSafe Clear from our Phones collection - authentic products at Shopzy marketplace.', 'The Phone Case MagSafe Clear by Core is a top pick in our Phones category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\n\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\n\nPart of the Shopzy Phones collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\n\nWarranty and care instructions follow the brand guidelines included with your order.', NULL, '2200.00', '999.00', '124', '1 unit', '1', '0', '0', '1', '0', '0', '50', '4.00', '2', 'Phone Case MagSafe Clear - Core | Buy Online at Shopzy', 'Buy Phone Case MagSafe Clear by Core at Shopzy marketplace. Shop Phone Case MagSafe Clear from our Phones collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'phone case magsafe clear, core, phones, buy phone case magsafe clear online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-12 22:24:50'),
('13', '2', 'Men\'s Casual Leather Sneakers', 'mens-casual-leather-sneakers', 'SZ-A73DF7', 'Aero', 'Shop Men\'s Casual Leather Sneakers from our Fashion collection - authentic products at Shopzy marketplace.', 'The Men\'s Casual Leather Sneakers by Aero is a top pick in our Fashion category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Fashion collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '6500.00', '5600.00', '65', '1 pair', '1', '1', '1', '1', '0', '0', '50', '4.90', '468', 'Men\'s Casual Leather Sneakers - Aero | Buy Online at Projoss', 'Buy Men\'s Casual Leather Sneakers by Aero at Shopzy marketplace. Shop Men\'s Casual Leather Sneakers from our Fashion collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'men\'s casual leather sneakers, aero, fashion, buy men\'s casual leather sneakers online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-12 22:58:51'),
('14', '16', 'Gawa Ghee 1kg', 'designer-travel-backpack-waterproof', 'SZ-487AA0', 'Nimbus', 'Shop Designer Travel Backpack Waterproof from our Fashion collection - authentic products at Shopzy marketplace.', 'The Designer Travel Backpack Waterproof by Nimbus is a top pick in our Fashion category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Fashion collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '5500.00', '4800.00', '140', '1 unit', '1', '1', '0', '1', '0', '0', '50', '4.80', '73', 'Designer Travel Backpack Waterproof - Nimbus | Buy Online at Projoss', 'Buy Designer Travel Backpack Waterproof by Nimbus at Shopzy marketplace. Shop Designer Travel Backpack Waterproof from our Fashion collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'designer travel backpack waterproof, nimbus, fashion, buy designer travel backpack waterproof online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-12 23:01:42'),
('25', '4', 'Vitamin C Serum 30ml', 'vitamin-c-serum-30ml', 'SZ-3B9666', 'GlowLab', 'Shop Vitamin C Serum 30ml from our Health & Beauty collection - authentic products at Shopzy marketplace.', 'The Vitamin C Serum 30ml by GlowLab is a top pick in our Health & Beauty category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Health & Beauty collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '1800.00', '1290.00', '170', '1 bottle', '1', '1', '1', '1', '0', '0', '50', '4.70', '403', 'Vitamin C Serum 30ml - GlowLab | Buy Online at Shopzy', 'Buy Vitamin C Serum 30ml by GlowLab at Shopzy marketplace. Shop Vitamin C Serum 30ml from our Health & Beauty collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'vitamin c serum 30ml, glowlab, health & beauty, buy vitamin c serum 30ml online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-12 22:56:57'),
('26', '4', 'Electric Toothbrush Kit', 'electric-toothbrush-kit', 'SZ-335E5C', 'SmileCo', 'Shop Electric Toothbrush Kit from our Health & Beauty collection - authentic products at Shopzy marketplace.', 'The Electric Toothbrush Kit by SmileCo is a top pick in our Health & Beauty category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Health & Beauty collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '4500.00', '3900.00', '181', '1 kit', '1', '1', '0', '1', '0', '0', '50', '4.80', '429', 'Electric Toothbrush Kit - SmileCo | Buy Online at Projoss', 'Buy Electric Toothbrush Kit by SmileCo at Shopzy marketplace. Shop Electric Toothbrush Kit from our Health & Beauty collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'electric toothbrush kit, smileco, health & beauty, buy electric toothbrush kit online, shopzy, bangladesh marketplace', '2026-08-02 03:28:11', '2026-08-12 22:59:46'),
('28', '4', 'Face Mask Sheet Pack 10', 'face-mask-sheet-pack-10', 'SZ-891A21', 'GlowLab', 'Shop Face Mask Sheet Pack 10 from our Health & Beauty collection - authentic products at Shopzy marketplace.', 'The Face Mask Sheet Pack 10 by GlowLab is a top pick in our Health & Beauty category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Health & Beauty collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '900.00', '650.00', '46', '1 pack', '1', '1', '0', '1', '0', '0', '50', '4.40', '122', 'Face Mask Sheet Pack 10 - GlowLab | Buy Online at Projoss', 'Buy Face Mask Sheet Pack 10 by GlowLab at Shopzy marketplace. Shop Face Mask Sheet Pack 10 from our Health & Beauty collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'face mask sheet pack 10, glowlab, health & beauty, buy face mask sheet pack 10 online, shopzy, bangladesh marketplace', '2026-08-02 03:28:12', '2026-08-12 23:16:42'),
('30', '7', 'Dumbbell Set 10kg Pair', 'dumbbell-set-10kg-pair', 'SZ-1EFE00', 'FitZone', 'Shop Dumbbell Set 10kg Pair from our Sports collection - authentic products at Shopzy marketplace.', 'The Dumbbell Set 10kg Pair by FitZone is a top pick in our Sports category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Sports collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '4500.00', '3990.00', '40', '1 pair', '1', '1', '0', '1', '0', '0', '50', '4.70', '190', 'Dumbbell Set 10kg Pair - FitZone | Buy Online at Shopzy', 'Buy Dumbbell Set 10kg Pair by FitZone at Shopzy marketplace. Shop Dumbbell Set 10kg Pair from our Sports collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'dumbbell set 10kg pair, fitzone, sports, buy dumbbell set 10kg pair online, shopzy, bangladesh marketplace', '2026-08-02 03:28:12', '2026-08-12 22:52:27'),
('31', '6', 'Sports Water Bottle 750ml', 'sports-water-bottle-750ml', 'SZ-FE066F', 'Aero', 'Shop Sports Water Bottle 750ml from our Sports collection - authentic products at Shopzy marketplace.', 'The Sports Water Bottle 750ml by Aero is a top pick in our Sports category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Sports collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '1200.00', '890.00', '66', '1 unit', '1', '0', '1', '1', '0', '0', '50', '4.40', '449', 'Sports Water Bottle 750ml - Aero | Buy Online at Projoss', 'Buy Sports Water Bottle 750ml by Aero at Shopzy marketplace. Shop Sports Water Bottle 750ml from our Sports collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'sports water bottle 750ml, aero, sports, buy sports water bottle 750ml online, shopzy, bangladesh marketplace', '2026-08-02 03:28:12', '2026-08-12 22:53:33'),
('32', '7', 'Resistance Band Set', 'resistance-band-set', 'SZ-8E412A', 'Core', 'Shop Resistance Band Set from our Sports collection - authentic products at Shopzy marketplace.', 'The Resistance Band Set by Core is a top pick in our Sports category. Shop genuine products at Shopzy with secure checkout and nationwide delivery.\r\n\r\nEvery listing is checked before it goes live. Choose your preferred option at checkout and enjoy secure packaging from warehouse to doorstep.\r\n\r\nPart of the Shopzy Sports collection, this product is backed by our easy return policy. Order today and pay conveniently with Cash on Delivery or mobile banking anywhere in Bangladesh.\r\n\r\nWarranty and care instructions follow the brand guidelines included with your order.', '[]', '1500.00', '1190.00', '165', '1 set', '1', '1', '1', '0', '0', '0', '50', '4.60', '54', 'Resistance Band Set - Core | Buy Online at Projoss', 'Buy Resistance Band Set by Core at Shopzy marketplace. Shop Resistance Band Set from our Sports collection - authentic products at Shopzy marketplace. Fast delivery and Cash on Delivery.', 'resistance band set, core, sports, buy resistance band set online, shopzy, bangladesh marketplace', '2026-08-02 03:28:12', '2026-08-12 22:54:22'),
('33', '10', 'Take Projoss Website Design Service', 'take-projoss-website-design-service', NULL, NULL, 'Build &  Grow with\r\nWebsites That Drive Sales\r\nWe craft standout websites for every business and individual. Whether you\'re a startup or a big company, our fresh solutions make you shine online.', 'Website Care Made Easy\r\nLet us take care of your website. Experience seamless management and expert solutions.\r\n\r\nAdSense Approval\r\nAdSense Approval\r\nGet AdSense Approval on Your New Domain (100% Guaranteed Success).\r\n\r\nBook Now\r\nWebsite Speed\r\nWebsite Speed\r\nWe Will Optimize Your Website Speed For Better Score & Ranking In Google\r\n\r\nBook Now\r\nAdSense & SEO Optimized\r\nAdSense & SEO Optimized\r\nAdSense & SEO Optimized Blog Setup Using GeneratePress Premium\r\n\r\nBook Now\r\nOn Page SEO\r\nOn Page SEO\r\nWe Will Fix The On Page SEO Errors To Get Better Ranking In Google Search\r\n\r\nBook Now\r\nDesign Issues\r\nDesign Issues\r\nWe Will Fix Any Design Issues and Enhance Your WordPress Website.\r\n\r\nBook Now\r\nBusiness Email\r\nBusiness Email\r\nWe Will Create Professional Business Email Like: [email protected]\r\n\r\nBook Now\r\nMigrate Your Website\r\nMigrate Your Website\r\nWe Will Seamlessly Migrate Your Website To The New Hosting Environment.\r\n\r\nBook Now\r\nGoogle Search Console\r\nGoogle Search Console\r\nWe Will Fix Google Search Console Issues To Achieve Better Ranking Results.\r\n\r\nBook Now', '[]', '10000.00', NULL, '50', NULL, '1', '0', '0', '0', '0', '0', '50', '0.00', '0', NULL, NULL, NULL, '2026-08-14 19:01:05', '2026-08-14 19:01:05');

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('5WdPZ1FB3jfaOClCuSCGu4oMovetUiXUgFWmAoT0', NULL, '127.0.0.1', 'Symfony', 'eyJfdG9rZW4iOiI5Rnlvdmg4TEJnQWtMTXdCYktyRzEyYUllZFhORUwyYkMwMzA0d0pTIiwiZXJyb3JzIjp7ImRlZmF1bHQiOnsiZm9ybWF0IjoiOm1lc3NhZ2UiLCJtZXNzYWdlcyI6eyJlbWFpbCI6WyJQbGVhc2Ugc2lnbiBpbiB3aXRoIGFuIGFkbWluaXN0cmF0b3IgYWNjb3VudC4iXX19fSwiX2ZsYXNoIjp7Im5ldyI6W10sIm9sZCI6WyJlcnJvcnMiXX0sIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3RcL2FkbWluXC9sYW5kaW5nLXBhZ2VzXC9kZXNpZ25zXC9jaGlsb3JhXC9wcmV2aWV3Iiwicm91dGUiOiJhZG1pbi5sYW5kaW5nLXBhZ2VzLmRlc2lnbnMucHJldmlldyJ9fQ==', '1786735113'),
('88n92kQuBleGgbuyWFKX3FRKYGZsIK53yoncBzRg', '1', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJHZUp6QXFkYnU0QlBwcUZuOEtPZFhIaE9iNlFZQW9UNENWZ0cxbngwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDA2XC9hZG1pblwvYWJhbmRvbmVkLWNoZWNrb3V0cyIsInJvdXRlIjoiYWRtaW4uYWJhbmRvbmVkLWNoZWNrb3V0cy5pbmRleCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX0sImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjoxLCJjYXJ0Ijp7IjMwfFdlaWdodDogMTBrZyI6eyJwcm9kdWN0X2lkIjozMCwicXR5IjoxLCJ2YXJpYW50IjoiV2VpZ2h0OiAxMGtnIn19fQ==', '1786731188'),
('AXVvd6ThsTOkE9iLBYaRhtWuj4mQhWAHsk1LctTt', '1', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI0eGZhckcxZzdFdFNObnRpdjE0QTlUdWN5TWtlMHEwNE9rNzhFYlc0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9jYXRlZ29yeVwvZ3JvY2VyaWVzIiwicm91dGUiOiJzaG9wLmNhdGVnb3J5In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsImZyb21fbGFuZGluZ19wYWdlIjoicHJvam9zcy14MS1sYW5kaW5nIiwicmVjZW50X29yZGVyIjoiT1JELTI2MDgxNC1GTzRDIiwiY2FydCI6eyIzM3wiOnsicHJvZHVjdF9pZCI6MzMsInF0eSI6MiwidmFyaWFudCI6bnVsbH19fQ==', '1786738207'),
('bXhoHzrNqLhaWBIcZg5uJlCoOCfenb8T36JETYqN', NULL, '127.0.0.1', 'Symfony', 'eyJfdG9rZW4iOiJVNURHbjhnRUpac1ZOTnZSdTM0ODVWSEFlQzFDOVltRk5RNnVuMXRFIiwiZnJvbV9sYW5kaW5nX3BhZ2UiOiJudXJheWEtbGFuZGluZyIsIl9wcmV2aW91cyI6eyJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3RcL2xwXC9udXJheWEtbGFuZGluZyIsInJvdXRlIjoibGFuZGluZy5zaG93In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1786735105'),
('ceyK5to64zJPvND87viztahJFdebFTSIminj6axz', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJnbWNkcXFrRHd6R1UxSXhTTkZXTDRRWGhxVUdtWWJ5Mk1oUkJURVdXIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9wcm9kdWN0XC9yZWRtaS1ub3RlLTEzLXBybyIsInJvdXRlIjoicHJvZHVjdC5zaG93In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1786801117'),
('FOj9rRGJ8lXws8GKj9T3z0OFBQ7UvGy6Wl29DNo4', '1', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJyWGh6RnZ6Zmd4MFduUER3MnF2VjJETXp3YURBenBLNWZaWGVVcGI0IiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfSwibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiOjEsInJlY2VudF9vcmRlciI6Ik9SRC0yNjA4MTQtSDdDNiJ9', '1786740142'),
('G3ztJj8yRylKSVmSoo8DsS79gIrahCMGkUzfdnBk', NULL, '127.0.0.1', 'Symfony', 'eyJfdG9rZW4iOiIwVUd5bG01REdiUm9xMHFYVGNONEJ1U2E3MWtEQ3g2a2dzVmpKZ29ZIiwiZnJvbV9sYW5kaW5nX3BhZ2UiOiJjaGlsb3JhLWxhbmRpbmciLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvbG9jYWxob3N0XC9scFwvY2hpbG9yYS1sYW5kaW5nIiwicm91dGUiOiJsYW5kaW5nLnNob3cifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1786735090'),
('G5oDnWDjKwadmaYBWwt2rCkvOWsLa6IoghRXbiNj', NULL, '127.0.0.1', 'curl/8.7.1', 'eyJfdG9rZW4iOiJNNFZKNkNJZUh0ZDc4RzBaTmI0ZGNwbjEzU3J6RTlJa01JMXJkNnVBIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1786800952'),
('GAgfTD0JWemTgO8iHwgBtw84tMjeQpQPq6y4osEX', '1', '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJRSVVCUDVSQW1nTkxmcUpCb202MFJGS3pRa1dlQ1dyUUtsS2VOZHBKIiwiX2ZsYXNoIjp7Im5ldyI6W10sIm9sZCI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL2FkbWluXC9vcmRlcnMiLCJyb3V0ZSI6ImFkbWluLm9yZGVycy5pbmRleCJ9LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MSwiZnJvbV9sYW5kaW5nX3BhZ2UiOiJwcm9qb3NzLXgxLWxhbmRpbmciLCJjYXJ0Ijp7Ijd8Q29sb3I6IFdoaXRlIjp7InByb2R1Y3RfaWQiOjcsInF0eSI6MSwidmFyaWFudCI6IkNvbG9yOiBXaGl0ZSJ9fX0=', '1786738460'),
('gI5ZjI9qIJceLlqYtxRvTXCstzWdxiulRI7RmVGE', NULL, '127.0.0.1', 'curl/8.7.1', 'eyJfdG9rZW4iOiJTZXc2aFJjMGNJeXFqNGVDcDZ6T3BnY0FWSlljb0RsbHNQYkFiM3JTIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1786729456'),
('Lh6oR3jsx5KvosX3CjvvkNrpnaxedqBYXiBx2J6d', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ0eDRXQ09WT2pCNTlRNTE3dUJ0MnFRajZaNjRNV0E5dlJScEdYcXNiIiwiX2ZsYXNoIjp7Im5ldyI6W10sIm9sZCI6W119LCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvMTI3LjAuMC4xOjgwMDBcL3Byb2R1Y3RcL3dpcmVsZXNzLWVhcmJ1ZHMtcHJvIiwicm91dGUiOiJwcm9kdWN0LnNob3cifSwicmVjZW50X29yZGVyIjoiT1JELTI2MDgxNC1MR0hDIn0=', '1786737992'),
('Ols0c1buDqG3F5zOKFXTHMOnDEsQahK9VMfMrFZU', NULL, '127.0.0.1', 'Symfony', 'eyJfdG9rZW4iOiJLR0pVcVZwY0JGTkR6WENQZEZFWmdIMW8xSWRyZ09qUnhKclU5dmxvIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1786735590'),
('pvPq8GBgpoEFHQxkxD8zhKFjK7e7DhnmOgEcnIMG', NULL, '127.0.0.1', 'curl/8.7.1', 'eyJfdG9rZW4iOiJHQUF3dnNHeTk3ajUyc0txdXE3N0hZUW5hTEZQZWJCZU5JQUVPN2pqIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', '1786739375'),
('zmMGs8884YoP2s64ZLgT8dO1U8PVGhUNcu3iulEG', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJDTlFJcGFFWHRjUGFseTJPaUtIek5oV3FET2pvZUx4REFZbWI2UEZKIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9hZG1pblwvbG9naW4iLCJyb3V0ZSI6ImFkbWluLmxvZ2luIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', '1786732899');

INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
('1', 'site_name', 'Projoss', '2026-08-02 03:28:11', '2026-08-12 20:49:25'),
('2', 'tagline', 'Your everyday online marketplace', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('3', 'logo', 'uploads/branding/c1cb8752-f66a-4efe-9a7c-937be9fc8589.png', '2026-08-02 03:28:11', '2026-08-12 20:54:46'),
('4', 'favicon', '', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('5', 'footer_text', 'Your everyday online marketplace - millions of products, flash deals and vouchers, delivered across the country.', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('6', 'contact_phone', '+880 1700-15042', '2026-08-02 03:28:11', '2026-08-12 22:48:24'),
('7', 'whatsapp_number', '+8801923443872', '2026-08-02 03:28:11', '2026-08-12 22:48:44'),
('8', 'messenger_page', 'sabuj.page', '2026-08-02 03:28:11', '2026-08-12 22:48:44'),
('9', 'contact_email', 'support@projoss.com', '2026-08-02 03:28:11', '2026-08-12 22:48:24'),
('10', 'contact_address', 'Dhaka 1207, Bangladesh', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('11', 'contact_hours', 'Sat-Thu, 9am - 9pm', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('12', 'contact_title', 'Get in touch', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('13', 'contact_intro', 'We usually reply within a few hours.', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('14', 'search_placeholder', 'Search in Projoss...', '2026-08-02 03:28:11', '2026-08-12 20:49:25'),
('15', 'facebook_url', 'https://facebook.com/', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('16', 'instagram_url', 'https://instagram.com/', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('17', 'twitter_url', 'https://twitter.com/', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('18', 'bkash_number', '01700000000', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('19', 'nagad_number', '01800000000', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('20', 'rocket_number', '01900000000', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('21', 'pay_cod_enabled', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('22', 'pay_bkash_enabled', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('23', 'pay_nagad_enabled', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('24', 'pay_rocket_enabled', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('25', 'show_cards_in_footer', '0', '2026-08-02 03:28:11', '2026-08-12 22:45:30'),
('26', 'shipping_inside_dhaka', '60', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('27', 'shipping_outside_dhaka', '120', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('28', 'tax_percent', '5', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('29', 'shipping_inside_label', 'Inside Dhaka', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('30', 'shipping_outside_label', 'Outside Dhaka', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('31', 'currency_symbol', '৳', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('32', 'currency_code', 'BDT', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('33', 'default_meta_title', 'Projoss- Online Shopping Marketplace', '2026-08-02 03:28:11', '2026-08-12 22:30:18'),
('34', 'default_meta_description', 'Projoss - flash deals, vouchers and millions of products. Fast delivery and Cash on Delivery across Bangladesh.', '2026-08-02 03:28:11', '2026-08-12 22:30:18'),
('35', 'default_meta_keywords', 'Projoss, marketplace, online shopping, flash sale, vouchers, bangladesh', '2026-08-02 03:28:11', '2026-08-12 22:30:18'),
('36', 'tracking_gtm_id', '', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('37', 'tracking_ga4_id', '', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('38', 'tracking_meta_pixel_id', '45654645645646', '2026-08-02 03:28:11', '2026-08-14 18:46:49'),
('39', 'otp_enabled', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('40', 'show_brands_marquee', '1', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('41', 'brands_marquee', 'Volt, Pixel, Nimbus, Aero, Quanta, Core', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('42', 'header_promo_text', '📱 Save more on the Projoss app', '2026-08-02 03:28:11', '2026-08-13 16:38:58'),
('43', 'header_promo_link', '/shop', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('44', 'shop_subtitle', 'Browse electronics, fashion, home & living and more - flash deals every day.', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('45', 'flash_sale_ends_at', '2026-08-14 10:28:00', '2026-08-02 03:28:11', '2026-08-14 17:50:01'),
('46', 'deal_ends_at', '2026-08-07 10:28:00', '2026-08-02 03:28:11', '2026-08-13 16:38:58'),
('47', 'delivery_eta_text', 'Estimated delivery in 2-3 days', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('48', 'homepage_tab_count', '8', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('49', 'home_categories_title', 'Categories', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('50', 'home_hot_deal_title', 'Flash Sale', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('51', 'home_featured_title', 'Just For You', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('52', 'home_deal_week_title', 'Latest Products', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('53', 'home_tabs_title', 'Best Sellers', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('54', 'home_brands_label', 'Official brand stores', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('55', 'home_view_more_label', 'View all', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('56', 'default_cta_text', 'ORDER NOW', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('57', 'product_cta_action', 'checkout', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('58', 'hero_fallback_badge', '11.11 SALE', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('59', 'hero_fallback_title', 'Up to 70% off everything', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('60', 'hero_fallback_subtitle', 'Millions of products. Free shipping vouchers. New deals every hour.', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('61', 'terms_content', 'drgtdf', '2026-08-02 03:28:11', '2026-08-12 22:29:50'),
('62', 'privacy_content', 'rdsgtrt', '2026-08-02 03:28:11', '2026-08-12 22:29:50'),
('63', 'mail_mailer', 'smtp', '2026-08-02 03:28:11', '2026-08-14 18:43:26'),
('64', 'mail_host', '', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('65', 'mail_port', '587', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('66', 'mail_username', '', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('67', 'mail_password', '', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('68', 'mail_encryption', 'tls', '2026-08-02 03:28:11', '2026-08-02 03:28:11'),
('69', 'mail_from_address', 'no-reply@projoss.com', '2026-08-02 03:28:11', '2026-08-14 18:43:26'),
('70', 'mail_from_name', 'Projoss', '2026-08-02 03:28:11', '2026-08-14 18:43:26'),
('71', 'landing_design_chilora_visible', '1', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('72', 'landing_design_nuraya_visible', '1', '2026-08-02 03:28:12', '2026-08-02 03:28:12'),
('73', 'refund_content', 'ghjhgjhgj', '2026-08-12 22:47:37', '2026-08-12 22:47:37'),
('74', 'courier_default', 'steadfast', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('75', 'steadfast_api_key', 'ace225nojzhjklgn5xp2cbwtwbpp2bqr', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('76', 'steadfast_secret_key', 't0lsbkndbcu60e6ejicmychm', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('77', 'pathao_client_id', '', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('78', 'pathao_client_secret', '', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('79', 'pathao_username', '', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('80', 'pathao_password', '', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('81', 'pathao_store_id', '', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('82', 'redx_api_token', '', '2026-08-12 23:53:10', '2026-08-12 23:53:10'),
('84', 'fog_ip_cooldown_minutes', '0', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('85', 'fog_phone_cooldown_minutes', '0', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('86', 'fog_max_orders_per_phone', '0', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('87', 'fog_bdcourier_min_success_rate', '0', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('88', 'fog_bdcourier_block_risk_levels', 'danger,high', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('89', 'fog_enabled', '1', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('90', 'fog_ip_block_enabled', '1', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('91', 'fog_device_block_enabled', '1', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('92', 'fog_phone_block_enabled', '1', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('93', 'fog_fake_number_block_enabled', '1', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('94', 'fog_auto_block_ip_on_cancel', '0', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('95', 'fog_bdcourier_enabled', '1', '2026-08-13 16:12:30', '2026-08-13 16:12:30'),
('96', 'fog_bdcourier_auto_check_checkout', '1', '2026-08-13 16:12:30', '2026-08-13 16:16:23'),
('97', 'fog_bdcourier_api_key', 'Y71ajGzb2bee2ujlOZkroNp96CNzwxFlJpTJBXwlkqJZSAHB57J10b6z1qLe', '2026-08-13 16:16:23', '2026-08-13 17:27:35'),
('98', 'chat_enabled', '1', '2026-08-14 17:50:18', '2026-08-14 17:50:18'),
('99', 'call_number', '01923443872', '2026-08-14 17:50:18', '2026-08-14 17:51:01');

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `phone`, `address`, `city`, `postal_code`, `remember_token`, `created_at`, `updated_at`) VALUES
('1', 'Store Admin', 'admin@projoss.com', '2026-08-02 03:28:11', '$2y$12$7TJang8Cfb8klXWQm21Q..MEcpg7wvUYOw7EtAVS881E9hRuNCqVe', 'admin', '+880 1700-000000', NULL, NULL, NULL, NULL, '2026-08-02 03:28:11', '2026-08-12 22:21:15'),
('2', 'Rahim Uddin', 'customer@shopzy.test', '2026-08-02 03:28:11', '$2y$12$9RED2e8..JOT0hnf94N6weBtX0rPvnfW/cBUJCXOljI1Lfm0nj6pG', 'customer', '01711-111111', 'House 12, Road 5, Dhanmondi', 'Dhaka', '1205', NULL, '2026-08-02 03:28:11', '2026-08-02 03:28:11');

SET FOREIGN_KEY_CHECKS = 1;
