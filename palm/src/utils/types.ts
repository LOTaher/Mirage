export interface Session {
  id: number;
  name: string;
  attendance: number;
}

export interface Member {
  name: string;
  slackID: string;
}
