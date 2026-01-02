🥋 PRODUCT REQUIREMENTS DOCUMENT (PRD)
Karate Tournament Management System (WKF-Style, Local → National)
1. PRODUCT OVERVIEW
1.1 Product Name

Karate Tournament Management System (KTMS)

1.2 Product Vision

To create a single authoritative tournament system where:

Kata and Kumite scoring follow latest WKF-style rules

Winners, medals, and team rankings are automatically calculated

Tournament committee and coaches see the same official data at the same time

Local tournaments can run smoothly without manual calculations or disputes

2. CORE PRODUCT PRINCIPLES (NON-NEGOTIABLE)

Single Source of Truth

There is only ONE official result table.

All dashboards (admin, committee, coach) reflect this table.

Automatic Calculation

If a scoring system is enabled, the system calculates everything.

No manual math by humans.

Role-Based Authority

Admin controls rules and structure.

Referees/Judges execute matches.

Coaches only observe and track.

Transparency

Same scores, same winners, same team rankings for everyone.

No hidden or parallel data.

3. USER ROLES & PERMISSIONS
3.1 Admin / Tournament Committee

Role Type: Full authority

Can do:

Create tournaments

Create, modify, merge, or delete categories

Add or remove entries

Enable / disable scoring systems

Configure rules (points, medals, team scoring)

Approve final results

Override results (with reason)

Cannot:

Participate as a coach or athlete

3.2 Referee / Judge

Role Type: Match execution only

Can do:

Enter Kata scores

Control Kumite scoring (points, penalties, timer)

End matches

Cannot:

Edit categories

Modify results after finalization

See admin-only controls

3.3 Coach

Role Type: Read-only + team management

Can do:

Create and manage their dojo/team

Add students

Track:

Matches

Scores

Medals

Team ranking

Cannot:

Edit scores

Edit results

Modify tournament rules

4. TOURNAMENT SETUP REQUIREMENTS
4.1 Tournament Creation

Admin can create a tournament with:

Tournament name

Level (Local / District / Open)

Events enabled:

Kata

Kumite

Both

Team Championship:

Enabled / Disabled

4.2 Category Management

Admin must be able to:

Create categories using:

Age range

Gender

Belt level

Weight range (Kumite)

Merge categories if entries are low

Split categories if needed

Add or remove participants

Lock category once matches start

5. KATA SCORING SYSTEM (MANDATORY)
5.1 Scoring Rules

Number of judges: 5 or 7 (admin configurable)

Each judge gives one score

System automatically:

Removes highest score

Removes lowest score

Sums remaining scores

Final score decides ranking

5.2 Tie Handling

If scores are equal:

Apply predefined tie-break rule

Or admin/manual decision (if configured)

5.3 Visibility Rules

Judges: see only their input

Admin & committee: see full score breakdown

Coaches: see final score only

6. KUMITE SCORING SYSTEM (MANDATORY)
6.1 Point System

Yuko → 1 point

Waza-ari → 2 points

Ippon → 3 points

6.2 Match Rules

Match timer (age-based duration)

Automatic win conditions:

Time up → higher score

8-point lead

Disqualification

Senshu (first score advantage) if enabled

6.3 Penalties

Progressive penalty system

System handles escalation

Disqualification handled automatically

7. OFFICIAL RESULTS & MEDALS
7.1 Official Result Table

Each category has one official result table

Winners are marked only once

Medal assignment:

Gold

Silver

Bronze

7.2 Auto Synchronization Rule

Once a result is official:

Coach dashboard updates automatically

Team points update automatically

Leaderboards update automatically

There is no manual syncing.

8. TEAM / DOJO CHAMPIONSHIP SYSTEM
8.1 Team Concept

Coaches create teams (dojos/clubs)

Athletes represent one team per tournament

Team championship is optional per tournament

8.2 Team Point Rules

Default:

Gold → 3 points

Silver → 2 points

Bronze → 1 point

Admin can:

Change point values

Disable any medal type (e.g., ignore bronze)

Disable team scoring entirely

8.3 Auto Calculation

Team score = sum of enabled medal points

Updates in real time

Recalculation happens if rules change

8.4 Team Leaderboard

Must show:

Rank

Team name

Gold / Silver / Bronze count

Total points

Tie-break logic:

More gold

More silver

More bronze

Admin decision

9. COACH DASHBOARD REQUIREMENTS
Coaches must be able to:

View all their athletes

See:

Match status

Results

Medals

Team score and rank

Track each athlete’s contribution to team score

Coaches must NOT be able to:

Edit scores

Edit results

Change rules

10. SHARED VISIBILITY MODEL
Who sees what

Admin, committee, and coaches all see:

Same scores

Same winners

Same team rankings

Optional Public View

Live scores

Medal tally

Team leaderboard

11. FLEXIBILITY & REAL-WORLD HANDLING

System must support:

Late entries

Category merging

Walkovers

Exhibition matches (no medals, no points)

Disqualification and result correction

12. NON-FUNCTIONAL REQUIREMENTS (CONCEPTUAL)

Easy to understand UI

Works for local tournaments with minimal staff

Clear status indicators (official / pending / corrected)

Transparent rule configuration

13. OUT OF SCOPE (FOR NOW)

Video judging

AI judging

Season-long rankings

Athlete health analytics

14. FINAL PRODUCT STATEMENT

KTMS is a centralized karate tournament system where WKF-style Kata and Kumite scoring, official results, medals, and team championships are automatically calculated and transparently visible to tournament committees and coaches in real time.

15. INSTRUCTION FOR CURSOR (IMPORTANT)

When using this PRD in Cursor:

Build features module by module

Do NOT assume hidden rules

Treat admin configuration as the driver of behavior

Respect role boundaries strictly