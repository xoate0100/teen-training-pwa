# Git Aliases and Configuration

This project has been configured with git aliases and settings to prevent chat agents from getting stuck in pager mode.

## Available PowerShell Aliases

The following aliases are available in PowerShell sessions:

| Alias | Command                        | Description                        |
| ----- | ------------------------------ | ---------------------------------- |
| `gst` | `git --no-pager status`        | Show git status without pager      |
| `gad` | `git --no-pager add`           | Add files to staging without pager |
| `gco` | `git --no-pager commit`        | Commit changes without pager       |
| `glo` | `git --no-pager log --oneline` | Show git log without pager         |
| `gdf` | `git --no-pager diff`          | Show git diff without pager        |

## Code Quality Aliases

Additional aliases for maintaining code quality:

| Alias           | Command                                      | Description                    |
| --------------- | -------------------------------------------- | ------------------------------ |
| `glint`         | `npx eslint . --ext .js,.jsx,.ts,.tsx`       | Run ESLint to check for errors |
| `glint:fix`     | `npx eslint . --ext .js,.jsx,.ts,.tsx --fix` | Run ESLint and auto-fix errors |
| `gtest`         | `npm test`                                   | Run tests before committing    |
| `gformat`       | `npm run format`                             | Format code with Prettier      |
| `gformat:check` | `npm run format:check`                       | Check code formatting          |

## Usage Examples

```powershell
# Instead of: git status
gst

# Instead of: git add .
gad .

# Instead of: git commit -m "message"
gco "commit message"

# Instead of: git log --oneline -10
glo 10

# Instead of: git diff
gdf
```

## Recommended Git Workflow with Code Quality

**ALWAYS follow this workflow before committing:**

```powershell
# 1. Check current status
gst

# 2. Add files to staging
gad .

# 3. Run ESLint to check for errors
glint

# 4. If ESLint finds errors, fix them automatically
glint:fix

# 5. Run ESLint again to verify fixes
glint

# 6. Run tests (if available)
gtest

# 7. Only commit if all checks pass
gco "descriptive commit message"
```

**Quick Quality Check Commands:**

```powershell
# Check for ESLint errors
glint

# Auto-fix ESLint errors
glint:fix

# Run tests
gtest

# Check git status
gst
```

## Global Git Configuration

The following global git settings have been applied:

- `core.pager=cat` - Disables pager for all git commands
- `core.editor=notepad` - Uses notepad instead of vim/nano

## For Chat Agents

**Recommended approach**: Use the PowerShell aliases when available, or use `--no-pager` flag with regular git commands:

```powershell
# Preferred (if aliases are loaded):
gst
gad .
gco "message"

# Alternative (always works):
git --no-pager status
git --no-pager add .
git --no-pager commit -m "message"
```

## Preventing Hangs on All Git Commands

To prevent hangs on ANY git command, use these environment variables:

```powershell
# Set these before running git commands
$env:GIT_PAGER = "cat"
$env:GIT_EDITOR = "notepad"
$env:GIT_MERGE_AUTOEDIT = "no"
```

Or add them to your PowerShell profile for permanent effect.

## Loading Aliases in New Sessions

To load the aliases in a new PowerShell session:

```powershell
. $PROFILE
```

Or restart PowerShell (aliases load automatically).
