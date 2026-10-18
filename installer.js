/** @param {NS} ns */
export async function main(ns) {
  const repoOwner = "TheOnly-Coder";
  const repoName = "kaze";

  // Detect default branch (main or master)
  let branch = "main";
  let apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${branch}?recursive=1`;
  let response = await fetch(apiUrl);

  if (!response.ok) {
    branch = "master";
    apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/${branch}?recursive=1`;
    response = await fetch(apiUrl);
  }

  if (!response.ok) {
    ns.tprint(`[ERROR] Unable to fetch repository tree. Status: ${response.status}`);
    return;
  }

  const data = await response.json();
  const files = data.tree.filter(item => item.type === "blob");

  ns.tprint(`Found ${files.length} files in ${repoOwner}/${repoName} (${branch}). Downloading...`);

  let downloaded = 0;
  for (const file of files) {
    const rawUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${file.path}`;
    const destination = file.path;

    const success = await ns.wget(rawUrl, destination);
    if (success) {
      downloaded++;
      ns.tprint(`[${downloaded}/${files.length}] Downloaded: ${destination}`);
    } else {
      ns.tprint(`[FAILED] Could not download: ${destination}`);
    }
  }

  ns.tprint(`\nSUCCESS: Downloaded ${downloaded} files to your home server.`);
}
