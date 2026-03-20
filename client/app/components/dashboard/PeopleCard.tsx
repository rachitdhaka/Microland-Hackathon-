import { User as UserIcon, Mail, Phone, Calendar } from "lucide-react";

interface PeopleCardProps {
  name: string;
  bio: string;
  skills: string[];
  availability: string;
  email: string;
  number?: string;
}

export function PeopleCard({ name, bio, skills, availability, email, number }: PeopleCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card text-card-foreground shadow-sm flex flex-col h-full transition-all hover:shadow-md hover:border-muted-foreground/30 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-muted/50 border border-border">
            <UserIcon size={18} className="text-foreground" />
          </div>
          <h3 className="font-bold leading-tight tracking-tight text-xl line-clamp-1">
            {name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 flex-grow flex flex-col gap-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {bio || "No bio provided."}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={14} />
            <span className="truncate">{email}</span>
          </div>
          {number && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone size={14} />
              <span>{number}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Calendar size={14} />
            <span>Availability: {availability}</span>
          </div>
        </div>
      </div>

      {/* Footer Area with subtle gray background */}
      <div className="bg-muted/30 border-t border-border mt-auto">
        {/* Tags */}
        <div className="px-6 pt-5 pb-5 min-h-[64px] flex flex-wrap gap-2 content-start">
          {skills && skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-background text-muted-foreground shadow-sm hover:border-muted-foreground/50"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground italic">No skills listed</span>
          )}
        </div>
      </div>
    </article>
  );
}
