#!/bin/sh
set -eu

REPO="${KAZE_REPO:-TheOnly-Coder/kaze}"
BRANCH="${KAZE_BRANCH:-main}"
REMOTE_URL="${KAZE_REMOTE_URL:-https://github.com/$REPO.git}"
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

die() { printf 'kaze: %s\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "'$1' is required but was not found in PATH."; }

ask() {
  printf '%s' "$1" >&2
  REPLY=""
  if IFS= read -r REPLY; then return 0; fi
  if [ -r /dev/tty ] && IFS= read -r REPLY < /dev/tty; then return 0; fi
  return 1
}

has_text() {
  case "$1" in
    *[![:space:]]*) return 0 ;;
    *) return 1 ;;
  esac
}

usage() {
  cat <<EOF
Kaze uploader - pushes the latest Bitburner Kaze OS files to $REPO.

Usage: $(basename -- "$0") [message]

With no arguments you are asked for the commit message, then every change in
this folder is committed and pushed to $BRANCH. A message can also be passed
directly, e.g. $(basename -- "$0") "add update.js".

Environment overrides: KAZE_REPO, KAZE_BRANCH, KAZE_REMOTE_URL
EOF
}

ensure_repo() {
  need git
  if [ ! -d "$ROOT/.git" ]; then
    git -C "$ROOT" init -q
    git -C "$ROOT" symbolic-ref -q HEAD refs/heads/main 2>/dev/null || true
  fi
  if ! git -C "$ROOT" remote get-url origin >/dev/null 2>&1; then
    git -C "$ROOT" remote add origin "$REMOTE_URL"
    echo "Added git remote origin -> $REMOTE_URL"
  fi
}

align_with_remote() {
  git -C "$ROOT" fetch -q origin "$BRANCH" 2>/dev/null || return 0
  git -C "$ROOT" rev-parse --verify -q "origin/$BRANCH" >/dev/null 2>&1 || return 0

  if ! git -C "$ROOT" rev-parse --verify -q HEAD >/dev/null 2>&1; then
    echo "No local git history yet; adopting origin/$BRANCH."
    git -C "$ROOT" reset -q "origin/$BRANCH"
    return 0
  fi

  if ! git -C "$ROOT" merge-base HEAD "origin/$BRANCH" >/dev/null 2>&1; then
    echo "Local history is unrelated to origin/$BRANCH; keeping local files on top of it."
    git -C "$ROOT" reset -q "origin/$BRANCH"
  fi
}

cmd_commit() {
  ensure_repo

  msg="${1:-}"
  if [ -z "$msg" ]; then
    ask 'Commit message: ' || die "could not read a commit message."
    msg="$REPLY"
  fi
  has_text "$msg" || die "commit message cannot be empty."

  align_with_remote
  git -C "$ROOT" add -A

  if git -C "$ROOT" diff --cached --quiet; then
    echo "No changes to commit."
    if ! git -C "$ROOT" rev-parse --verify -q HEAD >/dev/null 2>&1; then
      die "nothing to commit in an empty repository."
    fi
  else
    dels=$(git -C "$ROOT" diff --cached --name-only --diff-filter=D)
    if [ -n "$dels" ]; then
      echo "These files will be deleted:"
      printf '%s\n' "$dels" | while IFS= read -r d; do printf '  - %s\n' "$d"; done
      ask 'Continue? (y/n) ' || die "aborted."
      case "$REPLY" in
        y|Y) ;;
        *) die "aborted." ;;
      esac
    fi
    git -C "$ROOT" commit -m "$msg"
  fi

  if git -C "$ROOT" fetch -q origin "$BRANCH" 2>/dev/null &&
     git -C "$ROOT" rev-parse --verify -q "origin/$BRANCH" >/dev/null 2>&1; then
    if ! git -C "$ROOT" merge-base --is-ancestor "origin/$BRANCH" HEAD 2>/dev/null; then
      echo "Rebasing on origin/$BRANCH..."
      git -C "$ROOT" rebase "origin/$BRANCH" ||
        die "rebase failed. Fix conflicts, run 'git rebase --continue', then push manually."
    fi
  fi

  git -C "$ROOT" push -u origin "HEAD:$BRANCH"
  echo "Pushed to $REPO ($BRANCH)."
}

case "${1:-}" in
  ""|commit)
    if [ -n "${1:-}" ]; then shift; fi
    cmd_commit "$@"
    ;;
  help|-h|--help) usage ;;
  *) die "unknown option: $1 (run '$(basename -- "$0") help')" ;;
esac
