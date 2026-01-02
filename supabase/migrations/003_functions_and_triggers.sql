-- Functions and Triggers for automatic calculations
-- PRD Section 2: Automatic Calculation

-- Function to automatically calculate team championship points
-- PRD Section 8.3: Auto Calculation
CREATE OR REPLACE FUNCTION update_team_championship()
RETURNS TRIGGER AS $$
DECLARE
  tournament_record RECORD;
  team_stats RECORD;
  point_rules JSONB;
BEGIN
  -- Get tournament and point rules
  SELECT t.id, t.team_championship_enabled, tr.team_point_rules
  INTO tournament_record
  FROM public.tournaments t
  LEFT JOIN public.tournament_rules tr ON tr.tournament_id = t.id
  WHERE EXISTS (
    SELECT 1 FROM public.categories c
    WHERE c.tournament_id = t.id AND c.id = NEW.category_id
  )
  LIMIT 1;

  -- Only update if team championship is enabled
  IF tournament_record.team_championship_enabled = true THEN
    -- This would be handled by application logic
    -- as we need to aggregate results by team
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync official results (PRD Section 7.2: Auto Synchronization)
-- Note: This is a placeholder - actual team point calculation happens in application
CREATE OR REPLACE FUNCTION notify_result_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify via Supabase real-time
  PERFORM pg_notify('official_results_changed', json_build_object(
    'category_id', NEW.category_id,
    'athlete_id', NEW.athlete_id,
    'status', NEW.status
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER official_results_notify
  AFTER INSERT OR UPDATE ON public.official_results
  FOR EACH ROW
  EXECUTE FUNCTION notify_result_change();

-- Function to get team championship leaderboard
-- PRD Section 8.4: Team Leaderboard
CREATE OR REPLACE FUNCTION get_team_leaderboard(p_tournament_id UUID)
RETURNS TABLE (
  team_id UUID,
  team_name TEXT,
  gold_count BIGINT,
  silver_count BIGINT,
  bronze_count BIGINT,
  total_points BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH team_medals AS (
    SELECT 
      t.id AS team_id,
      t.name AS team_name,
      COUNT(*) FILTER (WHERE or_result.medal = 'Gold') AS gold_count,
      COUNT(*) FILTER (WHERE or_result.medal = 'Silver') AS silver_count,
      COUNT(*) FILTER (WHERE or_result.medal = 'Bronze') AS bronze_count
    FROM public.teams t
    INNER JOIN public.athletes a ON a.team_id = t.id
    INNER JOIN public.official_results or_result ON or_result.athlete_id = a.id
    INNER JOIN public.categories c ON c.id = or_result.category_id
    WHERE c.tournament_id = p_tournament_id
      AND or_result.status = 'official'
    GROUP BY t.id, t.name
  ),
  point_rules AS (
    SELECT team_point_rules
    FROM public.tournament_rules
    WHERE tournament_id = p_tournament_id
    LIMIT 1
  )
  SELECT 
    tm.team_id,
    tm.team_name,
    tm.gold_count,
    tm.silver_count,
    tm.bronze_count,
    (tm.gold_count * COALESCE((pr.team_point_rules->>'gold')::INTEGER, 3) +
     tm.silver_count * COALESCE((pr.team_point_rules->>'silver')::INTEGER, 2) +
     tm.bronze_count * COALESCE((pr.team_point_rules->>'bronze')::INTEGER, 1)) AS total_points
  FROM team_medals tm
  CROSS JOIN point_rules pr
  ORDER BY total_points DESC, gold_count DESC, silver_count DESC, bronze_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

