"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  File,
  Folder,
  Upload,
  Search,
  Grid3X3,
  List,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Star,
  Clock,
  User,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  Plus,
  Filter,
} from "lucide-react"

const mockFiles = [
  {
    id: 1,
    name: "Team Strategy 2024.pdf",
    type: "document",
    size: "2.4 MB",
    modified: "2024-01-15",
    owner: "Coach Johnson",
    shared: true,
    starred: true,
    folder: "Strategy Documents",
  },
  {
    id: 2,
    name: "Training Videos",
    type: "folder",
    size: "156 MB",
    modified: "2024-01-14",
    owner: "Assistant Coach",
    shared: false,
    starred: false,
    items: 12,
  },
  {
    id: 3,
    name: "Game Highlights.mp4",
    type: "video",
    size: "45.2 MB",
    modified: "2024-01-13",
    owner: "Media Team",
    shared: true,
    starred: false,
    folder: "Media",
  },
  {
    id: 4,
    name: "Player Stats.xlsx",
    type: "spreadsheet",
    size: "1.8 MB",
    modified: "2024-01-12",
    owner: "Analytics Team",
    shared: true,
    starred: true,
    folder: "Analytics",
  },
  {
    id: 5,
    name: "Team Photos",
    type: "folder",
    size: "89.5 MB",
    modified: "2024-01-11",
    owner: "Photography Team",
    shared: true,
    starred: false,
    items: 24,
  },
  {
    id: 6,
    name: "Playbook.pdf",
    type: "document",
    size: "5.1 MB",
    modified: "2024-01-10",
    owner: "Coach Johnson",
    shared: false,
    starred: true,
    folder: "Strategy Documents",
  },
  {
    id: 7,
    name: "Injury Reports.docx",
    type: "document",
    size: "892 KB",
    modified: "2024-01-09",
    owner: "Medical Team",
    shared: true,
    starred: false,
    folder: "Medical",
  },
  {
    id: 8,
    name: "Team Anthem.mp3",
    type: "audio",
    size: "4.2 MB",
    modified: "2024-01-08",
    owner: "Media Team",
    shared: true,
    starred: false,
    folder: "Media",
  },
]

const fileTypeIcons = {
  folder: Folder,
  document: FileText,
  spreadsheet: FileText,
  video: Video,
  audio: Music,
  image: ImageIcon,
  archive: Archive,
}

const fileTypeColors = {
  folder: "text-primary",
  document: "text-destructive",
  spreadsheet: "text-chart-5",
  video: "text-chart-3",
  audio: "text-chart-4",
  image: "text-secondary",
  archive: "text-muted-foreground",
}

export default function FilesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredFiles = mockFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || file.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getFileIcon = (type: string) => {
    const IconComponent = fileTypeIcons[type as keyof typeof fileTypeIcons] || File
    return IconComponent
  }

  const getFileColor = (type: string) => {
    return fileTypeColors[type as keyof typeof fileTypeColors] || "text-muted-foreground"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Team Files</h1>
            <p className="text-muted-foreground">Share and manage your team's documents and media</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedFilter("all")}>All Files</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("folder")}>Folders</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("document")}>Documents</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("video")}>Videos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("image")}>Images</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter("audio")}>Audio</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex border border-border rounded-md">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Starred</h3>
                  <p className="text-sm text-muted-foreground">Quick access</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Recent</h3>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Share2 className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Shared</h3>
                  <p className="text-sm text-muted-foreground">With team</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-5/10 rounded-lg">
                  <User className="w-5 h-5 text-chart-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">My Files</h3>
                  <p className="text-sm text-muted-foreground">Personal files</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Files Grid/List */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const IconComponent = getFileIcon(file.type)
              const colorClass = getFileColor(file.type)
              return (
                <Card key={file.id} className="cursor-pointer hover:bg-accent/5 transition-colors group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-card ${colorClass}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="w-4 h-4 mr-2" />
                            {file.starred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1 line-clamp-2">{file.name}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        {file.starred && <Star className="w-3 h-3 fill-current text-primary" />}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {file.shared && (
                          <Badge variant="outline" className="text-xs">
                            Shared
                          </Badge>
                        )}
                        {file.type === "folder" && (
                          <Badge variant="outline" className="text-xs">
                            {file.items} items
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Modified {formatDate(file.modified)} by {file.owner}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {filteredFiles.map((file) => {
                  const IconComponent = getFileIcon(file.type)
                  const colorClass = getFileColor(file.type)
                  return (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 hover:bg-accent/5 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg bg-card ${colorClass}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground truncate">{file.name}</h3>
                          {file.starred && <Star className="w-3 h-3 fill-current text-primary flex-shrink-0" />}
                          {file.shared && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              Shared
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{file.owner}</span>
                          <span>{formatDate(file.modified)}</span>
                          <span>{file.size}</span>
                          {file.type === "folder" && <span>{file.items} items</span>}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="w-4 h-4 mr-2" />
                            {file.starred ? "Unstar" : "Star"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <File className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Upload your first file to get started"}
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
