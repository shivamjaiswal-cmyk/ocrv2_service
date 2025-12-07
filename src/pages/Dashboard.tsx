import { 
  Settings2, 
  GitBranch, 
  FlaskConical, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dashboardStats, recentActivity } from "@/lib/mockData";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your OCR configuration status and recent activity.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Configs
            </CardTitle>
            <Settings2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeConfigs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across 4 modules
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Mappings
            </CardTitle>
            <GitBranch className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pendingMappings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fields need attention
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Test Runs Today
            </CardTitle>
            <FlaskConical className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.testRunsToday}</div>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Error Rate
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.errorRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Config Health */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Config Health</CardTitle>
            <CardDescription>Status of all configurations by module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium">Healthy</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-success h-full rounded-full transition-all"
                    style={{ width: `${(dashboardStats.configHealth.healthy / 12) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">
                  {dashboardStats.configHealth.healthy}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium">Warning</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-warning h-full rounded-full transition-all"
                    style={{ width: `${(dashboardStats.configHealth.warning / 12) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">
                  {dashboardStats.configHealth.warning}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="text-sm font-medium">Error</span>
                </div>
                <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-destructive h-full rounded-full transition-all"
                    style={{ width: `${(dashboardStats.configHealth.error / 12) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium w-8 text-right">
                  {dashboardStats.configHealth.error}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Link to="/config-hierarchy">
                <Button variant="outline" className="w-full">
                  View All Configs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest configuration changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Settings2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.target}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <Link to="/audit-trail">
                <Button variant="outline" className="w-full">
                  View Audit Trail
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/config-hierarchy">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <GitBranch className="h-5 w-5 text-primary" />
                <span>New Config</span>
              </Button>
            </Link>
            <Link to="/ocr-sandbox">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <FlaskConical className="h-5 w-5 text-info" />
                <span>Run OCR Test</span>
              </Button>
            </Link>
            <Link to="/field-mapping">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Settings2 className="h-5 w-5 text-warning" />
                <span>Fix Mappings</span>
              </Button>
            </Link>
            <Link to="/validation-rules">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span>View Alerts</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
