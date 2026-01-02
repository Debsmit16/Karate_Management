# How to Get Your Supabase Database Connection String

## Method 1: From Supabase Dashboard (Recommended)

1. **Go to your Supabase project**: https://app.supabase.com/project/orokrcisrptwteoqijbs

2. **Navigate to Settings**:
   - Click the **Settings** icon (⚙️) in the left sidebar
   - Click **Database**

3. **Get Connection String**:
   - Scroll down to **"Connection string"** section
   - You'll see two options:
     - **URI** - For connection pooling (recommended for applications)
     - **Direct connection** - For migrations and admin tasks (recommended for migrations)

4. **For Migrations, use "Direct connection"**:
   - Click on **"Direct connection"** tab
   - Copy the connection string
   - It will look like:
     ```
     postgresql://postgres.orokrcisrptwteoqijbs:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your database password (set when creating the project)

## Method 2: Construct It Manually

If you know your database password, you can construct it:

```
postgresql://postgres.orokrcisrptwteoqijbs:[PASSWORD]@aws-0-[region].pooler.supabase.com:5432/postgres
```

Where:
- `orokrcisrptwteoqijbs` is your project reference
- `[PASSWORD]` is your database password
- `[region]` is your database region (e.g., `us-east-1`)

## Method 3: Using Connection Pooling (Alternative)

For connection pooling (port 6543):
```
postgresql://postgres.orokrcisrptwteoqijbs:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Security Note

⚠️ **Never commit your connection string to Git!**
- It contains your database password
- Use environment variables or `.env` file (already in `.gitignore`)

## Usage

Once you have the connection string, you can:

1. **Run migrations via script**:
   ```bash
   node scripts/run-migrations-psql.js "postgresql://postgres:password@host:port/dbname"
   ```

2. **Or set as environment variable**:
   ```bash
   $env:DATABASE_URL="postgresql://postgres:password@host:port/dbname"
   node scripts/run-migrations-psql.js
   ```

3. **Or use psql directly**:
   ```bash
   psql "postgresql://postgres:password@host:port/dbname" -f supabase/migrations/001_initial_schema.sql
   ```

