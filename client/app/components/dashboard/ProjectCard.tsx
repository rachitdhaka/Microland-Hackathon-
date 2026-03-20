import Link from "next/link";

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  requiredRoles: string[];
}

export function ProjectCard({ id, title, description, requiredRoles }: ProjectCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col h-full transition-all hover:shadow-md hover:border-muted-foreground/30 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <h3 className="font-bold leading-tight tracking-tight text-xl line-clamp-1">
          {title}
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer Area with subtle gray background */}
      <div className="bg-muted/30 border-t border-border mt-auto">
        {/* Tags */}
        <div className="px-6 pt-5 pb-2 min-h-[64px] flex flex-wrap gap-2 content-start">
          {requiredRoles.map((role) => (
            <span
              key={role}
              className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-background text-muted-foreground shadow-sm"
            >
              {role}
            </span>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex items-center px-6 pb-5 pt-3">
          <Link
            href={`/projects/${id}`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow h-10 px-4 py-2 w-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
