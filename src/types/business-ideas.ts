export type BusinessAreaId =
  | "local-presence"
  | "conversion"
  | "retention"
  | "automation"
  | "internal-tools"
  | "ai"
  | "website"
  | "custom-tools"
  | "apps"
  | "e-commerce";

export type BusinessGoalId =
  | "more-bookings"
  | "less-manual-work"
  | "better-website"
  | "build-an-idea"
  | "not-sure";

export type BusinessIdea = Readonly<{
  area: BusinessAreaId;
  title: string;
  description: string;
}>;

type GoalContent = Readonly<{
  label: string;
  introduction: string;
}>;

export type BusinessGoal = GoalContent &
  (
    | Readonly<{
        id: Exclude<BusinessGoalId, "not-sure">;
        selection: "guided";
        ideas: readonly BusinessIdea[];
      }>
    | Readonly<{
        id: "not-sure";
        selection: "automatic";
        ideas: readonly [];
      }>
  );

export type BusinessService = Readonly<{
  id: BusinessAreaId;
  name: string;
  description: string;
  scope: string;
}>;

export type IdeasRequest = Readonly<{
  goal: BusinessGoalId;
  link: string;
  description: string;
}>;

export type BusinessContext = Readonly<{
  link: string;
  source: "website" | "description";
  text: string;
  description: string;
  sourceLinks?: readonly string[];
}>;

export type Opportunity = Readonly<{
  area: BusinessAreaId;
  title: string;
  explanation: string;
  build: string;
  basis: "public-content" | "your-description" | "possibility";
  evidence: string | null;
}>;

export type IdeasResult = Readonly<{
  businessName: string;
  link: string;
  source: BusinessContext["source"];
  opportunities: readonly Opportunity[];
  sourceLinks?: readonly string[];
}>;

export type IdeasErrorCode =
  | "invalid-input"
  | "needs-context"
  | "unsafe-link"
  | "rate-limited"
  | "unavailable"
  | "timeout"
  | "generation-failed";

export type IdeasResponse =
  | { status: "success"; result: IdeasResult }
  | { status: "error"; code: IdeasErrorCode; message: string };
