"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, Filter } from "lucide-react"

const mockEvents = [
  {
    id: 1,
    title: "Team Practice",
    date: "2024-01-15",
    time: "18:00",
    duration: "2 hours",
    location: "Main Stadium",
    type: "practice",
    attendees: 22,
    description: "Regular team practice session focusing on defensive strategies",
  },
  {
    id: 2,
    title: "Championship Game",
    date: "2024-01-18",
    time: "19:30",
    duration: "2.5 hours",
    location: "City Arena",
    type: "game",
    attendees: 25,
    description: "Championship final against Team Rivals",
  },
  {
    id: 3,
    title: "Team Meeting",
    date: "2024-01-20",
    time: "16:00",
    duration: "1 hour",
    location: "Conference Room A",
    type: "meeting",
    attendees: 18,
    description: "Strategy discussion and game plan review",
  },
  {
    id: 4,
    title: "Training Camp",
    date: "2024-01-22",
    time: "09:00",
    duration: "6 hours",
    location: "Training Facility",
    type: "training",
    attendees: 30,
    description: "Intensive training camp with guest coaches",
  },
  {
    id: 5,
    title: "Recovery Session",
    date: "2024-01-25",
    time: "14:00",
    duration: "1.5 hours",
    location: "Recovery Center",
    type: "recovery",
    attendees: 15,
    description: "Post-game recovery and physiotherapy session",
  },
]

const eventTypeColors = {
  practice: "bg-primary text-primary-foreground",
  game: "bg-destructive text-destructive-foreground",
  meeting: "bg-secondary text-secondary-foreground",
  training: "bg-accent text-accent-foreground",
  recovery: "bg-chart-5 text-white",
}

const eventTypeIcons = {
  practice: Users,
  game: Calendar,
  meeting: Users,
  training: Clock,
  recovery: Clock,
}

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "agenda">("month")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const filteredEvents =
    selectedFilter === "all" ? mockEvents : mockEvents.filter((event) => event.type === selectedFilter)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return filteredEvents
      .filter((event) => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Team Schedule</h1>
            <p className="text-muted-foreground">Manage your team's events and activities</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <Button variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")} size="sm">
            Month
          </Button>
          <Button variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")} size="sm">
            Week
          </Button>
          <Button variant={view === "agenda" ? "default" : "outline"} onClick={() => setView("agenda")} size="sm">
            Agenda
          </Button>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedFilter === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter("all")}
          >
            All Events
          </Badge>
          <Badge
            variant={selectedFilter === "practice" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter("practice")}
          >
            Practice
          </Badge>
          <Badge
            variant={selectedFilter === "game" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter("game")}
          >
            Games
          </Badge>
          <Badge
            variant={selectedFilter === "meeting" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter("meeting")}
          >
            Meetings
          </Badge>
          <Badge
            variant={selectedFilter === "training" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedFilter("training")}
          >
            Training
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simple Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 6 + 1
                    const hasEvent =
                      day > 0 && day <= 31 && mockEvents.some((event) => new Date(event.date).getDate() === day)
                    return (
                      <div
                        key={i}
                        className={`
                          text-center p-2 text-sm cursor-pointer rounded-md transition-colors
                          ${
                            day > 0 && day <= 31
                              ? "hover:bg-accent hover:text-accent-foreground"
                              : "text-muted-foreground/50"
                          }
                          ${hasEvent ? "bg-primary/10 text-primary font-medium" : ""}
                        `}
                      >
                        {day > 0 && day <= 31 ? day : ""}
                        {hasEvent && <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1"></div>}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getUpcomingEvents().map((event) => {
                  const IconComponent = eventTypeIcons[event.type as keyof typeof eventTypeIcons]
                  return (
                    <div
                      key={event.id}
                      className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground">{event.title}</h3>
                        <Badge className={eventTypeColors[event.type as keyof typeof eventTypeColors]}>
                          {event.type}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {event.time} ({event.duration})
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3" />
                          {event.attendees} attendees
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.description}</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event List View */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>All Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const IconComponent = eventTypeIcons[event.type as keyof typeof eventTypeIcons]
                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${eventTypeColors[event.type as keyof typeof eventTypeColors]}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground">{event.title}</h3>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(event.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
