import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ComponentIcon, Settings2Icon, CalendarIcon, DownloadIcon, PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ username: string }>;
}

async function getUserProfile(username: string) {
  const user = await prisma.user.findFirst({
    where: { username: username.toLowerCase() },
    select: {
      id: true,
      name: true,
      image: true,
      username: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const components = await prisma.component.findMany({
    where: { userId: user.id, isPublic: true },
    orderBy: { createdAt: "desc" },
    include: {
      files: true,
      metrics: true,
    },
  });

  const totalInstallations = await prisma.metrics.aggregate({
    where: { userId: user.id },
    _sum: { installations: true },
  });

  return {
    user,
    components,
    stats: {
      totalComponents: components.length,
      totalInstallations: totalInstallations._sum.installations || 0,
    },
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  
  return {
    title: `@${username} | SharedCN`,
    description: `View components and setups by @${username}`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const data = await getUserProfile(username);

  if (!data) {
    notFound();
  }

  const { user, components, stats } = data;
  const componentItems = components.filter((c) => c.type === "component");
  const setupItems = components.filter((c) => c.type === "setup");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.username || "User"}
                className="w-24 h-24 rounded-full border-4 border-background shadow-xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-4xl font-bold text-primary border-4 border-background shadow-xl">
                {(user.name || user.username || "U")[0].toUpperCase()}
              </div>
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {user.name || `@${user.username}`}
              </h1>
              <p className="text-muted-foreground text-lg">@{user.username}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalComponents}</div>
                <div className="text-sm text-muted-foreground">Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.totalInstallations}</div>
                <div className="text-sm text-muted-foreground">Installs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Components Section */}
        {componentItems.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <ComponentIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Components</h2>
              <Badge variant="secondary">{componentItems.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {componentItems.map((component) => (
                <ComponentCard key={component.id} component={component} />
              ))}
            </div>
          </section>
        )}

        {/* Setups Section */}
        {setupItems.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Settings2Icon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Setups</h2>
              <Badge variant="secondary">{setupItems.length}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {setupItems.map((setup) => (
                <ComponentCard key={setup.id} component={setup} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {components.length === 0 && (
          <div className="text-center py-16">
            <PackageIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No public items yet</h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              @{user.username} hasn't published any public components or setups.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentCard({ component }: { component: any }) {
  const totalInstalls = component.metrics?.reduce((sum: number, m: any) => sum + (m.installations || 0), 0) || 0;
  
  return (
    <Link
      href={`/component/${component.id}`}
      className="group block p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {component.type === "setup" ? (
            <Settings2Icon className="w-4 h-4 text-amber-500" />
          ) : (
            <ComponentIcon className="w-4 h-4 text-blue-500" />
          )}
          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {component.alias.split("/").pop()}
          </h3>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {component.description || "No description"}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono text-primary/80">{component.alias}</span>
        {totalInstalls > 0 && (
          <span className="flex items-center gap-1">
            <DownloadIcon className="w-3 h-3" />
            {totalInstalls}
          </span>
        )}
      </div>

      {component.tags && component.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {component.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {component.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{component.tags.length - 3}
            </Badge>
          )}
        </div>
      )}
    </Link>
  );
}
