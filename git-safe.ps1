# Git Safe Wrapper Script
# This script provides git commands that won't get stuck in pager mode

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Arguments
)

# Add --no-pager to git commands that commonly use pager
$pagerCommands = @('status', 'log', 'diff', 'show', 'blame', 'grep', 'branch', 'tag')

if ($pagerCommands -contains $Command) {
    & git --no-pager $Command @Arguments
} else {
    & git $Command @Arguments
}
