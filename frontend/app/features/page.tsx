import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Powerful Features for Team Success</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how TeamTalk transforms the way sports teams communicate, collaborate, and achieve their goals
            together.
          </p>
        </div>

        <div className="space-y-24">
          {/* Messages Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Team Communication Made Simple</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Stay connected with your team through our comprehensive messaging system. Create team channels for
                different topics, send direct messages to teammates, and keep everyone in the loop with real-time
                notifications.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Team channels for organized discussions
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Direct messaging with teammates
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Real-time message delivery and notifications
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Online status indicators
                </li>
              </ul>
              <Link href="/messages">
                <Button className="bg-primary hover:bg-primary/90">Try Messages</Button>
              </Link>
            </div>
            <div className="relative">
              <Card className="shadow-2xl">
                <CardContent className="p-0">
                  <Image
                    src="https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/0b4dae6b254fd7bb480ccc8fc86da24361f5f1069563edd0809e423ee7b24818.jpg"
                    alt="Messages Interface showing team communication channels and direct messaging"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Schedule Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <Card className="shadow-2xl">
                <CardContent className="p-0">
                  <Image
                    src="https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/e4f2033b525350c719c40f1998aa09f78ae8b040ae051dc3377eb7d607214415.jpg"
                    alt="Schedule Interface showing monthly calendar with team events and practices"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-foreground mb-6">Never Miss a Game or Practice</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Keep your team organized with our comprehensive scheduling system. View upcoming events, track practices
                and games, and ensure everyone knows when and where to be.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Monthly calendar view with event details
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Filter events by type (practice, games, meetings)
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Event details with location and attendees
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Add new events and manage schedules
                </li>
              </ul>
              <Link href="/schedule">
                <Button className="bg-primary hover:bg-primary/90">View Schedule</Button>
              </Link>
            </div>
          </div>

          {/* Files Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Share Files and Resources Seamlessly</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Organize and share team documents, training videos, playbooks, and more with our Google Drive-style file
                management system. Keep all your team resources in one secure, accessible place.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Upload and organize team files
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Share documents with team members
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Quick access to starred and recent files
                </li>
                <li className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Grid and list view options
                </li>
              </ul>
              <Link href="/files">
                <Button className="bg-primary hover:bg-primary/90">Explore Files</Button>
              </Link>
            </div>
            <div className="relative">
              <Card className="shadow-2xl">
                <CardContent className="p-0">
                  <Image
                    src="https://xurtccytrzafbfk3.public.blob.vercel-storage.com/agent-assets/92c40d2a8d73bb6363b0a13719ec514546c94297decaad37b4d7ad6f3eaa2ac4.jpg"
                    alt="Files Interface showing Google Drive-style file management with grid and list views"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-auto"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-24">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Ready to Transform Your Team Communication?</CardTitle>
              <CardDescription className="text-primary-foreground/80 text-lg">
                Join thousands of teams already using TeamTalk to stay connected and achieve their goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-muted">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                  >
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
