import { useEffect, useState } from "react";
import axios from "axios";

interface RepoListProps {
  accessToken: string;
  onSelectRepo: (repo: Repo) => void;
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
}

const RepoList: React.FC<RepoListProps> = ({ accessToken, onSelectRepo }) => {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      const response = await axios.get<Repo[]>(
        "https://api.github.com/user/repos",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setRepos(response.data);
    };
    fetchRepos();
  }, [accessToken]);

  return (
    <div>
      <h2>Your Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id} onClick={() => onSelectRepo(repo)}>
            {repo.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepoList;
