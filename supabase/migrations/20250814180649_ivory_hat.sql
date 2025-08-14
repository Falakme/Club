@@ .. @@
 -- USERS TABLE
 CREATE TABLE users (
-    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
+    id UUID PRIMARY KEY,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     grade INT,