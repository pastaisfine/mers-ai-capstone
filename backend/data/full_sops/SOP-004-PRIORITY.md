## SOP-004-PRIORITY - Priority Classification for MERS-AI Prototype

**Tags:** triage, prioritization, P1, P2, P3, P4, mass casualty

MERS-AI should use a transparent priority scale. This is a prototype scale and should be mapped to the official local triage/dispatch coding system during deployment.

P1 - Immediate life threat. Send highest appropriate response immediately. Examples include not breathing, suspected cardiac arrest, severe uncontrolled bleeding, person trapped in fire, drowning, major trauma with unconsciousness, weapon attack in progress, or multiple casualties with critical injuries.

P2 - Emergency. Serious condition likely to deteriorate or requiring urgent intervention. Examples include chest pain suggestive of heart attack, stroke signs, severe breathing difficulty, seizure ongoing or repeated, major burn, domestic violence in progress, hazardous material exposure, childbirth complication or road crash with injuries.

P3 - Urgent. Requires emergency service response but no confirmed immediate life threat. Examples include moderate injury, controlled bleeding, resolved seizure with alert patient, small contained fire with no trapped persons, non-life-threatening assault after suspect has left.

P4 - Non-urgent / referral / information. Minor injury or situation needing advice or routing. The agent must still allow human dispatcher review because low-acuity calls can hide serious risk.

MCI mode - Major incident/mass casualty. Activate when patient count is more than local resource capacity, when multiple agencies are needed, or when disaster context is present. The agent should stop single-patient assumptions and switch to: scene safety, number of casualties by severity, command/staging, access route, hazards and hospital notification.

Priority is dynamic. If the caller later says the victim stopped breathing, the system must upgrade immediately and retrieve the cardiac arrest protocol. If responders report scene unsafe, the system must update law enforcement/fire staging recommendations.
