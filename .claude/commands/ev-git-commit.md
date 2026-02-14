---
description: Generate semantic commit messages with emojis by analyzing staged git changes, requiring user approval before committing
allowed-tools: Bash(git status:*), Bash(git diff --staged), Bash(git commit:*)
---


## Context:

- Current git status: !`git status`
- Current git diff: !`git diff --staged`

Analyze above staged git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

## Your task:

Analyze the staged git changes and create a commit message. Use present tense and explain "why" something has changed, not just "what" has changed.

## Commit types with emojis:
Only use the following emojis: 

- ✨ `feat:` - New feature
- 🐛 `fix:` - Bug fix
- 🔨 `refactor:` - Refactoring code
- 📝 `docs:` - Documentation
- 🎨 `style:` - Styling/formatting
- ✅ `test:` - Tests
- ⚡ `perf:` - Performance

## Format:
Use the following format for making the commit message:

```
<emoji> <type>: <concise_description>
<optional_body_explaining_why>
```

## Output:

1. Show summary of changes currently staged
2. Propose commit message with appropriate emoji
3. Ask for confirmation before committing

## IMPORTANT:
DO NOT auto-commit
Wait for user approval, and only commit if the user says Yes.