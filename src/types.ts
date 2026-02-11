export interface ProfileSummary {
  name: string;
  path: string;
  isLocal: boolean;
  description: string;
  tags: string[];
  variableCount: number;
}

export interface StatusVariable {
  value: string;
  source: string;
}

export interface EnvizeStatus {
  active_profiles: string[];
  variables: Record<string, StatusVariable>;
  applied_at: string;
}

export interface TemplateSummary {
  name: string;
  description: string;
  tags: string[];
}
