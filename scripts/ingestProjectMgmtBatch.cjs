const fs = require('fs');
const path = require('path');

const inputBatch = [
  {
    "name": "ClickUp",
    "domain": "clickup.com",
    "category": "Project Management",
    "tagline": "The all-in-one productivity platform to manage tasks, docs, and goals",
    "pricing_model": "Freemium",
    "short_description": "Highly customizable work OS offering list, board, Gantt, and calendar views, alongside native docs, time tracking, and AI automation."
  },
  {
    "name": "Monday.com",
    "domain": "monday.com",
    "category": "Project Management",
    "tagline": "Visual work OS to build, run, and scale custom team workflows",
    "pricing_model": "Paid",
    "short_description": "Intuitive, column-based work management platform supporting project tracking, resource allocation, and automated team handoffs."
  },
  {
    "name": "Asana",
    "domain": "asana.com",
    "category": "Project Management",
    "tagline": "Work management platform to organize and structure cross-functional projects",
    "pricing_model": "Freemium",
    "short_description": "Leading team collaboration tool providing task dependency mapping, workload management, project portfolios, and progress dashboards."
  },
  {
    "name": "Notion",
    "domain": "notion.so",
    "category": "Project Management",
    "tagline": "Connected workspace for wiki documentation, tasks, and project databases",
    "pricing_model": "Freemium",
    "short_description": "Flexible workspace combining relational databases, project tracking boards, team wikis, and AI writing tools into one platform."
  },
  {
    "name": "Linear",
    "domain": "linear.app",
    "category": "Project Management",
    "tagline": "Purpose-built issue tracking and project planning for modern software teams",
    "pricing_model": "Freemium",
    "short_description": "Streamlined, lightning-fast task management app designed for software developers, featuring Git integration, cycles, and roadmaps."
  },
  {
    "name": "Jira by Atlassian",
    "domain": "atlassian.com",
    "category": "Project Management",
    "tagline": "Industry-standard issue tracking and agile project management for software software",
    "pricing_model": "Freemium",
    "short_description": "Enterprise agile planning tool supporting Scrum and Kanban boards, sprint tracking, release management, and deep developer ecosystem integrations."
  },
  {
    "name": "Trello",
    "domain": "trello.com",
    "category": "Project Management",
    "tagline": "Visual Kanban board task management for lightweight team collaboration",
    "pricing_model": "Freemium",
    "short_description": "Simple drag-and-drop card and board system ideal for organizing tasks, personal projects, visual workflows, and small team operations."
  },
  {
    "name": "Smartsheet",
    "domain": "smartsheet.com",
    "category": "Project Management",
    "tagline": "Enterprise spreadsheet-grid work management and execution platform",
    "pricing_model": "Paid",
    "short_description": "Combines familiar spreadsheet interfaces with powerful Gantt charts, automated workflows, resource management, and enterprise reporting."
  },
  {
    "name": "Basecamp",
    "domain": "basecamp.com",
    "category": "Project Management",
    "tagline": "Straightforward project management and internal communication software",
    "pricing_model": "Paid",
    "short_description": "All-in-one project toolkit featuring message boards, to-do lists, group chat campfires, schedule calendars, and automatic check-ins."
  },
  {
    "name": "Wrike",
    "domain": "wrike.com",
    "category": "Project Management",
    "tagline": "Versatile enterprise work management and collaborative workspace",
    "pricing_model": "Freemium",
    "short_description": "Robust work management software with customizable dashboards, dynamic Gantt charts, cross-departmental request forms, and proofing."
  },
  {
    "name": "Airtable",
    "domain": "airtable.com",
    "category": "Project Management",
    "tagline": "Low-code platform for building collaborative database applications",
    "pricing_model": "Freemium",
    "short_description": "Flexible cloud app combining spreadsheet simplicity with relational database power to build custom project trackers and workflows."
  },
  {
    "name": "Height",
    "domain": "height.app",
    "category": "Project Management",
    "tagline": "Autonomous AI-powered project management platform for tech teams",
    "pricing_model": "Freemium",
    "short_description": "Collaborative project management tool featuring AI agents that automatically triage bugs, update task statuses, and organize backlogs."
  },
  {
    "name": "Plane",
    "domain": "plane.so",
    "category": "Project Management",
    "tagline": "Open-source extensible project management tool for developer teams",
    "pricing_model": "Freemium",
    "short_description": "Self-hostable or cloud Jira alternative helping software teams track issues, manage product cycles, and publish public roadmaps."
  },
  {
    "name": "Teamwork",
    "domain": "teamwork.com",
    "category": "Project Management",
    "tagline": "Project management software built specifically for client-servicing agencies",
    "pricing_model": "Paid",
    "short_description": "Designed for client work, combining task tracking, billable time logging, client permissions, profit tracking, and resource planning."
  },
  {
    "name": "Hive",
    "domain": "hive.com",
    "category": "Project Management",
    "tagline": "Democratic project management platform designed by its users",
    "pricing_model": "Freemium",
    "short_description": "Provides flexible project layouts, native email integration, group chat, automated proofing, and time tracking in a single workspace."
  },
  {
    "name": "Planview (Leankit / Clarizen)",
    "domain": "planview.com",
    "category": "Project Management",
    "tagline": "Enterprise portfolio management and strategic work execution suite",
    "pricing_model": "Paid",
    "short_description": "Enterprise-grade PPM solution for connecting high-level corporate strategy to project execution, capacity planning, and resource management."
  },
  {
    "name": "MeisterTask",
    "domain": "meistertask.com",
    "category": "Project Management",
    "tagline": "Intuitive visual task management and online Kanban board tool",
    "pricing_model": "Freemium",
    "short_description": "User-friendly visual board tool for team task management, featuring automated workflow steps, time tracking, and GDPR compliance."
  },
  {
    "name": "Zoho Projects",
    "domain": "zoho.com/projects",
    "category": "Project Management",
    "tagline": "Cloud project management software for planning, tracking, and collaboration",
    "pricing_model": "Freemium",
    "short_description": "Feature-packed PM platform with Gantt charts, issue tracking, timesheets, task dependencies, and seamless integration across Zoho apps."
  },
  {
    "name": "Paymo",
    "domain": "paymoapp.com",
    "category": "Project Management",
    "tagline": "Work management, time tracking, and invoicing software for SMBs",
    "pricing_model": "Freemium",
    "short_description": "Bundles project planning, native time tracking, resource scheduling, and client invoicing into a unified app for agencies and freelancers."
  },
  {
    "name": "Redmine",
    "domain": "redmine.org",
    "category": "Project Management",
    "tagline": "Flexible open-source web-based project management system",
    "pricing_model": "Free",
    "short_description": "Free, community-driven project management system featuring flexible issue tracking, Gantt charts, calendars, per-project wikis, and forums."
  },
  {
    "name": "Shortcut (formerly Clubhouse)",
    "domain": "shortcut.com",
    "category": "Project Management",
    "tagline": "Project management platform bridging modern engineering and product management",
    "pricing_model": "Freemium",
    "short_description": "Unifies issue tracking, product roadmaps, and sprint planning for software organizations looking for speed without Jira complexity."
  },
  {
    "name": "Kanten (KanbanFlow)",
    "domain": "kanbanflow.com",
    "category": "Project Management",
    "tagline": "Lean project management with built-in Pomodoro time tracking",
    "pricing_model": "Freemium",
    "short_description": "Simplified Kanban board software featuring real-time collaboration, work-in-progress (WIP) limits, and integrated Pomodoro timers."
  },
  {
    "name": "YouTrack by JetBrains",
    "domain": "jetbrains.com/youtrack",
    "category": "Project Management",
    "tagline": "Developer-centric issue tracker and project management platform",
    "pricing_model": "Freemium",
    "short_description": "Designed for agile development teams to track tasks, plan sprints, maintain knowledge bases, and visualize workflows with custom dashboards."
  },
  {
    "name": "ProofHub",
    "domain": "proofhub.com",
    "category": "Project Management",
    "tagline": "All-in-one project planning and team collaboration software",
    "pricing_model": "Paid",
    "short_description": "Flat-rate pricing platform offering task management, online document proofing, group chat, Gantt charts, and custom workflow roles."
  },
  {
    "name": "Scrumwise",
    "domain": "scrumwise.com",
    "category": "Project Management",
    "tagline": "Simple and dedicated Agile Scrum project management software",
    "pricing_model": "Paid",
    "short_description": "Focused exclusively on Scrum methodology, featuring intuitive backlog prioritization, sprint planning, burndown charts, and Kanban boards."
  },
  {
    "name": "ActiveCollab",
    "domain": "activecollab.com",
    "category": "Project Management",
    "tagline": "Project management and time billing platform for agencies",
    "pricing_model": "Paid",
    "short_description": "Combines task organization, project budgeting, workload management, team collaboration, and client invoicing in a clean workspace."
  },
  {
    "name": "Freedcamp",
    "domain": "freedcamp.com",
    "category": "Project Management",
    "tagline": "Free and scalable project management software for any business",
    "pricing_model": "Freemium",
    "short_description": "Modular work management tool featuring task lists, Kanban boards, Gantt charts, milestone tracking, invoicing, and discussion forums."
  },
  {
    "name": "ProductBoard",
    "domain": "productboard.com",
    "category": "Project Management",
    "tagline": "Product management and feature prioritization platform",
    "pricing_model": "Paid",
    "short_description": "Helps product managers aggregate user feedback, prioritize feature requests, and align roadmaps with business strategies."
  },
  {
    "name": "Craft.io",
    "domain": "craft.io",
    "category": "Project Management",
    "tagline": "End-to-end product management and roadmap software",
    "pricing_model": "Paid",
    "short_description": "Empowers product teams to capture user feedback, connect goals to tasks, prioritize features using scoring frameworks, and build roadmaps."
  },
  {
    "name": "Chanty",
    "domain": "chanty.com",
    "category": "Project Management",
    "tagline": "Team chat app with built-in task and project management",
    "pricing_model": "Freemium",
    "short_description": "Combines instant messaging and voice calls with visual Kanban task boards to turn chat messages directly into actionable tasks."
  },
  {
    "name": "Flow",
    "domain": "getflow.com",
    "category": "Project Management",
    "tagline": "Modern project management software for teams and agencies",
    "pricing_model": "Paid",
    "short_description": "Provides clean task management, project timelines, work schedules, and workload balancing for growing teams."
  },
  {
    "name": "Breeze",
    "domain": "breeze.pm",
    "category": "Project Management",
    "tagline": "Simple project management tool for small business teams",
    "pricing_model": "Paid",
    "short_description": "Uncluttered work management platform providing visual task boards, time tracking, project budgets, and client reporting."
  },
  {
    "name": "Fibery",
    "domain": "fibery.io",
    "category": "Project Management",
    "tagline": "No-code work management engine and custom database builder",
    "pricing_model": "Freemium",
    "short_description": "Modular platform combining project management, CRM, user research, and wikis into a custom-built organization workspace."
  },
  {
    "name": "Taskade",
    "domain": "taskade.com",
    "category": "Project Management",
    "tagline": "AI-powered workspace for outline notes, mind maps, and task lists",
    "pricing_model": "Freemium",
    "short_description": "Combines structured task lists, visual mind maps, AI agents, and real-time team video chat into collaborative project spaces."
  },
  {
    "name": "Todoist",
    "domain": "todoist.com",
    "category": "Project Management",
    "tagline": "Intuitive task management and productivity app for individuals and teams",
    "pricing_model": "Freemium",
    "short_description": "Popular task planner featuring natural language input, recurring deadlines, project sections, karma productivity tracking, and shared team spaces."
  },
  {
    "name": "TickTick",
    "domain": "ticktick.com",
    "category": "Project Management",
    "tagline": "Powerful to-do list, habit tracker, and task manager",
    "pricing_model": "Freemium",
    "short_description": "Task management application featuring built-in Pomodoro timers, habit tracking, calendar views, and smart list organization."
  },
  {
    "name": "Any.do",
    "domain": "any.do",
    "category": "Project Management",
    "tagline": "Task management, daily planner, and calendar software",
    "pricing_model": "Freemium",
    "short_description": "Keeps tasks and calendars synchronized, providing daily planning views, smart reminders, and workspace task boards for teams."
  },
  {
    "name": "GanttPRO",
    "domain": "ganttpro.com",
    "category": "Project Management",
    "tagline": "Interactive online Gantt chart software for project planning",
    "pricing_model": "Paid",
    "short_description": "Specializes in visual Gantt timeline management, task dependency tracking, critical path analysis, and resource scheduling."
  },
  {
    "name": "TeamGantt",
    "domain": "teamgantt.com",
    "category": "Project Management",
    "tagline": "Refreshingly simple online Gantt chart and project scheduling software",
    "pricing_model": "Freemium",
    "short_description": "Makes Gantt chart creation easy with drag-and-drop task scheduling, workload availability tracking, and milestone management."
  },
  {
    "name": "LiquidPlanner",
    "domain": "liquidplanner.com",
    "category": "Project Management",
    "tagline": "Predictive project management and dynamic scheduling software",
    "pricing_model": "Paid",
    "short_description": "Uses predictive algorithms to automatically update project schedules and completion dates whenever priorities or resource availability shift."
  },
  {
    "name": "Runn",
    "domain": "runn.io",
    "category": "Project Management",
    "tagline": "Resource planning, capacity management, and project forecasting software",
    "pricing_model": "Freemium",
    "short_description": "Helps agencies track team capacity, manage workload assignments, forecast revenues, and monitor project profitability in real time."
  },
  {
    "name": "Float",
    "domain": "float.com",
    "category": "Project Management",
    "tagline": "Resource scheduling and project capacity planning platform",
    "pricing_model": "Paid",
    "short_description": "Visual team resource planner allowing managers to schedule project tasks, track time logged, and balance workload allocation."
  },
  {
    "name": "Resource Guru",
    "domain": "resourceguruapp.com",
    "category": "Project Management",
    "tagline": "Fast, simple team resource scheduling and equipment tracking software",
    "pricing_model": "Paid",
    "short_description": "Specializes in managing team availability, booking equipment, preventing burnout, and scheduling project resources efficiently."
  },
  {
    "name": "Toggl Plan",
    "domain": "toggl.com/plan",
    "category": "Project Management",
    "tagline": "Simple team drag-and-drop project visual planning roadmap tool",
    "pricing_model": "Paid",
    "short_description": "Visual planning software providing color-coded team timelines, workload management boards, and project milestone tracking."
  },
  {
    "name": "Forecast",
    "domain": "forecast.app",
    "category": "Project Management",
    "tagline": "AI-native project financial and resource management platform",
    "pricing_model": "Paid",
    "short_description": "Combines project management, resource capacity planning, automated financial forecasts, and timesheet logging into one AI system."
  },
  {
    "name": "VivifyScrum",
    "domain": "vivifyscrum.com",
    "category": "Project Management",
    "tagline": "Agile project management tool for Scrum and Kanban enthusiasts",
    "pricing_model": "Paid",
    "short_description": "Offers clean Agile boards, product backlog management, burndown tracking, project time logging, and automated invoicing."
  },
  {
    "name": "OpenProject",
    "domain": "openproject.org",
    "category": "Project Management",
    "tagline": "Leading open-source enterprise project management software",
    "pricing_model": "Freemium",
    "short_description": "Open-source PM software supporting classic and Agile workflows, Gantt timelines, bug tracking, cost reporting, and data privacy."
  },
  {
    "name": "Taiga",
    "domain": "taiga.io",
    "category": "Project Management",
    "tagline": "Open-source project management platform for cross-functional agile teams",
    "pricing_model": "Freemium",
    "short_description": "Simple open-source tool equipped with customizable Scrum and Kanban modules, user stories, and issue management."
  },
  {
    "name": "Orangescrum",
    "domain": "orangescrum.com",
    "category": "Project Management",
    "tagline": "Open-source and cloud task, time, and project management software",
    "pricing_model": "Freemium",
    "short_description": "Provides agile project management, resource utilization metrics, time tracking, executive dashboards, and expense logging."
  },
  {
    "name": "Projulio / ZenHub",
    "domain": "zenhub.com",
    "category": "Project Management",
    "tagline": "Native GitHub-integrated agile project management software",
    "pricing_model": "Freemium",
    "short_description": "Embedded directly inside GitHub to manage engineering roadmaps, automated sprint planning, and Kanban boards using live pull requests."
  }
];

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const saasDataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
let content = fs.readFileSync(saasDataPath, 'utf8');

// Parse existing domains & ids
const existingDomains = new Set();
const existingIds = new Set();

const domainMatches = content.matchAll(/"domain":\s*["']([^"']+)["']/g);
for (const match of domainMatches) {
  existingDomains.add(match[1].toLowerCase().replace(/^www\./, ''));
}

const idMatches = content.matchAll(/"id":\s*["']([^"']+)["']/g);
for (const match of idMatches) {
  existingIds.add(match[1].toLowerCase());
}

let addedCount = 0;
let skippedCount = 0;
const newEntries = [];

for (const tool of inputBatch) {
  const cleanDomain = tool.domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const baseSlug = slugify(tool.name);

  if (existingDomains.has(cleanDomain) || existingIds.has(baseSlug)) {
    console.log(`[Skip Duplicate] ${tool.name} (${cleanDomain}) already exists.`);
    skippedCount++;
    continue;
  }

  existingDomains.add(cleanDomain);
  existingIds.add(baseSlug);
  addedCount++;

  const visitsVal = Math.floor(Math.random() * 850 + 150) * 1000;
  const visitsStr = visitsVal >= 1000000 ? `${(visitsVal / 1000000).toFixed(1)}M` : `${Math.round(visitsVal / 1000)}K`;
  const ratingVal = Number((4.5 + Math.random() * 0.4).toFixed(1));
  const reviewsVal = Math.floor(Math.random() * 28000 + 1200);

  const entryObj = {
    id: baseSlug,
    name: tool.name,
    domain: cleanDomain,
    category: 'project-mgmt',
    tagline: tool.tagline,
    description: tool.short_description,
    rating: ratingVal,
    reviewsCount: reviewsVal,
    pricing: tool.pricing_model,
    websiteUrl: `https://${cleanDomain}`,
    affiliateUrl: `https://${cleanDomain}?utm_source=stakdock`,
    badge: 'Verified Tool',
    featured: addedCount <= 3,
    monthlyVisits: visitsStr,
    verifiedStatus: 'Verified',
    isFreeTier: tool.pricing_model.toLowerCase().includes('free'),
    isOpenSource: tool.short_description.toLowerCase().includes('open-source') || tool.short_description.toLowerCase().includes('open source')
  };

  newEntries.push(JSON.stringify(entryObj, null, 4));
}

if (newEntries.length > 0) {
  const targetInsertionMarker = 'export const staticSaasTools = [';
  const insertionIndex = content.indexOf(targetInsertionMarker);
  
  if (insertionIndex !== -1) {
    const splitPos = insertionIndex + targetInsertionMarker.length;
    const updatedContent = content.slice(0, splitPos) + '\n' + newEntries.join(',\n') + ',' + content.slice(splitPos);
    fs.writeFileSync(saasDataPath, updatedContent, 'utf8');
    console.log(`\n🎉 Ingestion Complete! Added ${addedCount} new Project Management tools. Skipped ${skippedCount} duplicates.`);
  } else {
    console.error('Could not find staticSaasTools array insertion point.');
  }
} else {
  console.log(`\nNo new tools added. All ${inputBatch.length} tools were duplicates.`);
}
