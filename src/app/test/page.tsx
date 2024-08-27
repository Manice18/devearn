"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import RepoList from "@/components/Repos/RepoList";
import IssueList from "@/components/Repos/IssueList";

interface Session {
  user: {
    name: string;
  };
  accessToken: string;
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
}

export default function Home() {
  const session = useSession();
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  if (!session.data?.user) {
    return (
      <div>
        <h1>Welcome to the GitHub Repo Viewer</h1>
        <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Hello, {session.data.user.name}</h1>
      <button onClick={() => signOut()}>Sign out</button>

      {selectedRepo ? (
        <IssueList accessToken={session.data.token} repo={selectedRepo} />
      ) : (
        <RepoList
          accessToken={session.data.token}
          onSelectRepo={(repo) => setSelectedRepo(repo)}
        />
      )}
    </div>
  );
}
