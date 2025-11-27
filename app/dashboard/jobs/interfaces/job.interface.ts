export interface Job {
  id: string;
  title: string;
  companyName: string;
  status: "Draft" | "Published" | "Archived";
  applications: number;
  location: string;
  description: string;
  salaryRange: string;
  jobType: "Full-time" | "Part-time" | "Contract";
  experienceLevel: "Mid-Level" | "Senior" | "Junior" | "Intern";
  requiredSkills: string[];
  employerId: string;
  createdAt: string;
  updatedAt: string;
}
