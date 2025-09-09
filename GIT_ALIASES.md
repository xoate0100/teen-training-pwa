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

| Alias           | Command                | Description                    |
| --------------- | ---------------------- | ------------------------------ |
| `glint`         | `npm run lint`         | Run ESLint to check for errors |
| `glint:fix`     | `npm run lint:fix`     | Run ESLint and auto-fix errors |
| `gtest`         | `npm test`             | Run tests before committing    |
| `gformat`       | `npm run format`       | Format code with Prettier      |
| `gformat:check` | `npm run format:check` | Check code formatting          |

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

**⚠️ IMPORTANT: Always run quality checks before committing!**

- ESLint errors will cause build failures
- Unformatted code creates unnecessary diffs
- Tests ensure functionality works correctly

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

## Common Git CLI Issues and Solutions

### ⚠️ Critical: Avoiding Git Hook and Push Errors

**Problem 1: Missing Pre-Push Hook**
```
error: cannot spawn .husky/pre-push: No such file or directory
error: waitpid for (NULL) failed: No child processes
error: failed to push some refs to 'https://github.com/...'
```

**Solution:**
```powershell
# Check if pre-push hook exists
dir .husky

# If missing, recreate it
echo "# Run tests before pushing" > .husky/pre-push
echo "npm run test:run" >> .husky/pre-push
```

**Problem 2: No Upstream Branch**
```
fatal: The current branch feat/branch-name has no upstream branch.
```

**Solution:**
```powershell
# Set upstream and push
git push -u origin feat/branch-name

# Or for existing branches
git push --set-upstream origin feat/branch-name
```

**Problem 3: Git Hooks Not Executing**
```
→ No staged files match any configured task.
```

**Solution:**
```powershell
# Reinitialize Husky
npx husky init

# Verify hooks exist
dir .husky

# Test hooks manually
.husky/pre-commit
.husky/pre-push
```

### 🔧 Pre-Push Checklist

**Before pushing, always verify:**

1. **Hooks exist:**
   ```powershell
   dir .husky
   # Should show: pre-commit, pre-push, commit-msg
   ```

2. **Branch has upstream:**
   ```powershell
   git branch -vv
   # Look for [origin/branch-name] in output
   ```

3. **Tests pass:**
   ```powershell
   npm run test:run
   ```

4. **Code quality checks:**
   ```powershell
   glint
   glint:fix
   ```

### 🚨 Emergency Git Fixes

**If Git commands hang or fail:**

```powershell
# Reset git configuration
git config --global core.pager "cat"
git config --global core.editor "notepad"

# Clear any stuck processes
taskkill /f /im git.exe 2>$null

# Reset to clean state
git status
```

**If hooks are completely broken:**

```powershell
# Remove and reinstall Husky
rm -rf .husky
npm install husky --save-dev
npx husky init

# Recreate hooks
echo "npx lint-staged" > .husky/pre-commit
echo "npm run test:run" > .husky/pre-push
echo "npx --no -- commitlint --edit \${1}" > .husky/commit-msg
```

## Loading Aliases in New Sessions

To load the aliases in a new PowerShell session:

```powershell
. $PROFILE
```

Or restart PowerShell (aliases load automatically).
