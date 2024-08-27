import { useEffect, useState } from "react";
import axios from "axios";

interface IssueListProps {
  accessToken: string;
  repo: Repo;
}

interface Repo {
  id: number;
  name: string;
  full_name: string;
}

interface Issue {
  id: number;
  title: string;
}

const IssueList: React.FC<IssueListProps> = ({ accessToken, repo }) => {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const response = await axios.get<Issue[]>(
        `https://api.github.com/repos/${repo.full_name}/issues`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setIssues(response.data);
    };
    fetchIssues();
  }, [accessToken, repo]);

  return (
    <div>
      <h3>Issues in {repo.name}</h3>
      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>{issue.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default IssueList;
