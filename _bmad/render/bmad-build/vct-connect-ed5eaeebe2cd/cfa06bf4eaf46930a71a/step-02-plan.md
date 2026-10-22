# Step 2: Plan

## RULES

- No intermediate approvals.
- **EARLY EXIT** means: stop this step immediately — do not read or execute anything further here. Read and fully follow the target file instead. Return here ONLY if a later step explicitly says to loop back.

## INSTRUCTIONS

1. Draft resume check. If `{plan_file}` exists with `status: draft`, read it and capture the verbatim `<frozen-after-approval>...</frozen-after-approval>` block as `preserved_intent`. Otherwise `preserved_intent` is empty.
2. Investigate the codebase. When you can, send deep searches to subagents and wait for them in this turn. Tell them to return short summaries only, so this session does not fill up with their notes. Keep only what the work needs: the specific files, symbols or lines, what to reuse, and what not to change. Write that into the Code Map. Do not retell the investigation when implementation starts — the plan already has it.

   Do not ask the human during investigation. When something is unclear, look in the repository, planning artifacts, or history first. Keep looking until you know, or until those sources have nothing more to say. Leave any remaining choice for the next step.
3. Read `C:/Users/eidel/Desktop/VCT Connect/_bmad/render/bmad-build/vct-connect-ed5eaeebe2cd/cfa06bf4eaf46930a71a/plan-template.md` fully and write `{plan_file}`.
   Set `route: 'oneshot'`, `route_source: 'pinned'`, and `status: 'in-progress'`, resolving `date` to the current system date.
   If `preserved_intent` is non-empty, use it as the frozen block.
   **EARLY EXIT** → `C:/Users/eidel/Desktop/VCT Connect/_bmad/render/bmad-build/vct-connect-ed5eaeebe2cd/cfa06bf4eaf46930a71a/step-oneshot.md`.
