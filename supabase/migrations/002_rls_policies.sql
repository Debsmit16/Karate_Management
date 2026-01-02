-- Row Level Security Policies
-- PRD Section 3: Role-Based Authority

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Teams table policies
CREATE POLICY "Anyone can view teams"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Coaches can create their own team"
  ON public.teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'coach' AND id = coach_id
    )
  );

CREATE POLICY "Coaches can update their own team"
  ON public.teams FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'coach' AND id = coach_id
    )
  );

-- Athletes table policies
CREATE POLICY "Anyone can view athletes"
  ON public.athletes FOR SELECT
  USING (true);

CREATE POLICY "Coaches can create athletes for their team"
  ON public.athletes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can update athletes in their team"
  ON public.athletes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE id = team_id AND coach_id = auth.uid()
    )
  );

-- Tournaments table policies
CREATE POLICY "Anyone can view tournaments"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update tournaments"
  ON public.tournaments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Categories table policies
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create categories"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Category Participants policies
CREATE POLICY "Anyone can view category participants"
  ON public.category_participants FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage category participants"
  ON public.category_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Matches table policies
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins and referees can update matches"
  ON public.matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'referee')
    )
  );

-- Kata Scores policies
CREATE POLICY "Anyone can view kata scores"
  ON public.kata_scores FOR SELECT
  USING (true);

CREATE POLICY "Referees and admins can create kata scores"
  ON public.kata_scores FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'referee')
    )
  );

CREATE POLICY "Only admins can update kata scores after finalization"
  ON public.kata_scores FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    ) OR (
      status = 'pending' AND EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role IN ('admin', 'referee')
      )
    )
  );

-- Kumite Matches policies
CREATE POLICY "Anyone can view kumite matches"
  ON public.kumite_matches FOR SELECT
  USING (true);

CREATE POLICY "Referees and admins can create kumite matches"
  ON public.kumite_matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'referee')
    )
  );

CREATE POLICY "Referees and admins can update kumite matches"
  ON public.kumite_matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'referee')
    )
  );

-- Official Results policies (PRD Section 7: Single Source of Truth)
CREATE POLICY "Anyone can view official results"
  ON public.official_results FOR SELECT
  USING (true);

CREATE POLICY "Only admins can create official results"
  ON public.official_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can update official results"
  ON public.official_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tournament Rules policies
CREATE POLICY "Anyone can view tournament rules"
  ON public.tournament_rules FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage tournament rules"
  ON public.tournament_rules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

