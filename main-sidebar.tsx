"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import {
  Home,
  Calendar,
  FileText,
  Video,
  Ambulance,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  MessageSquare,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function MainSidebar() {
  const pathname = usePathname()
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

  const routes = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Appointments",
      icon: Calendar,
      href: "/appointments",
      badge: "3",
    },
    {
      title: "Medical Records",
      icon: FileText,
      href: "/medical-records",
      subItems: [
        { title: "Test Results", href: "/medical-records/test-results" },
        { title: "Prescriptions", href: "/medical-records/prescriptions" },
        { title: "Immunizations", href: "/medical-records/immunizations" },
      ],
    },
    {
      title: "Consultations",
      icon: Video,
      href: "/consultations",
    },
    {
      title: "Emergency",
      icon: Ambulance,
      href: "/emergency",
    },
    {
      title: "Reports",
      icon: AlertTriangle,
      href: "/reports",
    },
    {
      title: "Chatbot",
      icon: MessageCircle,
      href: "/chatbot",
      badge: "New",
    },
  ]

  return (
    <>
      <Sidebar className="border-r">
        <div className="flex h-full flex-col border-r bg-background dark:border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary-foreground"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div className="font-semibold text-xl">HealthConnect</div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  {route.subItems ? (
                    <>
                      <SidebarMenuButton
                        onClick={() => setOpenSubMenu(openSubMenu === route.title ? null : route.title)}
                        className="w-full justify-between"
                      >
                        <div className="flex items-center">
                          <route.icon className="h-5 w-5 mr-3" />
                          <span>{route.title}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openSubMenu === route.title ? "transform rotate-180" : ""}`}
                        />
                      </SidebarMenuButton>
                      {openSubMenu === route.title && (
                        <SidebarMenuSub>
                          {route.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                <Link href={subItem.href}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton asChild isActive={pathname === route.href}>
                      <Link href={route.href} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <route.icon className="h-5 w-5 mr-3" />
                          <span>{route.title}</span>
                        </div>
                        {route.badge && (
                          <Badge variant={route.title === "Chatbot" ? "default" : "secondary"} className="ml-auto">
                            {route.badge}
                          </Badge>
                        )}
                        {route.title === "Emergency" && (
                          <Badge variant="destructive" className="ml-auto">
                            SOS
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-muted-foreground">Patient ID: 12345</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </div>
      </Sidebar>
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  )
}

