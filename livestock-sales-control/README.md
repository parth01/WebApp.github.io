# Livestock Sales Control

Standalone livestock inventory and sales reconciliation application. This lives entirely under `livestock-sales-control/` so the existing project is untouched.

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create your first Supabase Auth user and make that user's profile `admin` with the SQL shown in the schema comments.
4. Put the Supabase URL and anon key in `js/config.js`.
5. Deploy the folder as a static site.

## Controls
- Multiple farm shipments per day, each with its own transaction ID.
- Farm count and farm weight are stored separately.
- Shop live count/weight and transport mortality count/weight are stored separately.
- Sales are weight-based and retain the applicable rate.
- Employee/bird allocations retain both count and weight.
- Daily and monthly reconciliation checks count, weight and sales arithmetic.
- Audit log records inserts, updates and deletes.

## Production rules to finalize
Before production, confirm opening/closing stock, stock carried overnight, partial shipments, post-arrival mortality, classification timing, scale tolerances, gross/net weight, and the exact format of official daily/monthly reports.