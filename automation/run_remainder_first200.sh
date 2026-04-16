#!/usr/bin/env bash
set -euo pipefail
cd ~/franchiese
while IFS=$'\t' read -r idx pdf slug mode; do
  echo "===== [$idx] $mode $slug ====="
  if [[ "$mode" == "replace" ]]; then
    rm -rf "runs/$slug"
  fi
  prompt_file="automation/prompts/${slug}.prompt.txt"
  log_file="automation/logs/${slug}.log"
  mkdir -p automation/prompts automation/logs
  printf 'Run %s\nPDF: %s\nSlug: %s\n' "$idx" "$pdf" "$slug" > "$prompt_file"
  bash automation/run_one_fresh.sh "$PWD" "$pdf" "$slug" "$prompt_file" "$log_file"
done < automation/remainder_first200_manifest.tsv
