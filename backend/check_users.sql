-- Check Users table
SELECT COUNT(*) as total_users FROM "Users";

-- Show first 5 users if any exist
SELECT "Id", "Name", "Email", "Role", "CreatedAt"
FROM "Users"
ORDER BY "CreatedAt" DESC
LIMIT 5;
