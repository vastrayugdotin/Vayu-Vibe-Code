# Vastrayug Development Rules

## Task Execution
- **Prompt Alignment**: Focus exclusively on development prompts from `docs/prompt.md`, strictly within the range **Step 4.6j to Step 4.9**.
- **Targeted File Access**: Read only the files strictly relevant to the current task. Do not explore or read unrelated files.
- **Step-by-Step Implementation**: Adhere strictly to the implementation steps provided by the user or the specific prompt being executed.
- **Confirmation & Integration**:
  - After completing a task, wait for the next command.
  - If a task involves integrating a newly created file (e.g., adding a component to a page), ask for explicit permission to perform the integration before proceeding.
- **No Proactivity**: Do not perform extra work, refactors, or move to subsequent prompts without direct instruction.

## Technical Standards
- **Paths**: Always use absolute paths (e.g., `D:/Vayu-Vibe-Code/vastrayug/...`).
- **Framework**: Next.js 14 (App Router), Prisma, Tailwind CSS, Zustand.
- **Tracking**: Follow `docs/tracking_events.md` for all analytics implementations.
