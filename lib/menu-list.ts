import {
    Users,
    Settings,
    LayoutGrid,
    FileSignature,
    LucideIcon,
    Pen,
    List,
    Radio,
    CircleCheck,
    BadgeX,
    BadgePercent,
    CircleDollarSign,
    Layers3,
    Medal,
    RefreshCcwDot,
    Ban,
    File,
    CalendarDays,
    Calendar,
    UserCog,
    GitCompareArrows,
    SquareStack,
    MicVocal,
    GalleryVertical,
    MessageSquare,
    Bell,
    Compass,
    BookOpenCheck,
    BookOpen,
    Headset,
  } from "lucide-react";
  
  type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
  };
  
  type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: any;
    submenus: Submenu[];
  };
  
  type Group = {
    groupLabel: string;
    menus: Menu[];
  };
  
  export function getMenuList(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname === "/dashboard",
            icon: LayoutGrid,
            submenus: [],
          },
        ],
      },
      {
        groupLabel: "Main",
        menus: [
          {
            href: "",
            label: "Unit",
            active: pathname.includes("/dashboard/unit"),
            icon: Layers3,
            submenus: [
              {
                href: "/dashboard/unit/create",
                label: "Create",
                active: pathname === "/dashboard/unit/create",
                icon: Pen,
              },
              {
                href: "/dashboard/unit",
                label: "List",
                active: pathname === "/dashboard/unit",
                icon: List,
              },
            ],
          },
          {
            href: "",
            label: "Scout",
            active: pathname.includes("/dashboard/scout"),
            icon: Users,
            submenus: [
              {
                href: "/dashboard/scout/request",
                label: "Request",
                active: pathname === "/dashboard/scout/request",
                icon: Radio,
              },
              {
                href: "/dashboard/scout/list",
                label: "List",
                active: pathname === "/dashboard/scout/list",
                icon: List,
              },
              {
                href: "/dashboard/scout/verified",
                label: "Verified",
                active: pathname === "/dashboard/scout/verified",
                icon: CircleCheck,
              },
              {
                href: "/dashboard/scout/suspended",
                label: "Suspended",
                active: pathname === "/dashboard/scout/suspended",
                icon: BadgeX,
              },
              {
                href: "/dashboard/scout/award",
                label: "Award",
                active: pathname === "/dashboard/scout/award",
                icon: Medal,
              },
            ],
          },
          {
            href: "",
            label: "Event",
            active: pathname.includes("/dashboard/event"),
            icon: CalendarDays,
            submenus: [
              {
                href: "/dashboard/event/create",
                label: "Create",
                active: pathname === "/dashboard/event/create",
                icon: Pen,
              },
              {
                href: "/dashboard/event/list",
                label: "List",
                active: pathname === "/dashboard/event/list",
                icon: List,
              },
            ],
          },
          {
            href: "",
            label: "Training",
            active: pathname.includes("/dashboard/training"),
            icon: GitCompareArrows,
            submenus: [
              {
                href: "/dashboard/training/create",
                label: "Create",
                active: pathname === "/dashboard/training/create",
                icon: Pen,
              },
              {
                href: "/dashboard/training/list",
                label: "List",
                active: pathname === "/dashboard/training/list",
                icon: List,
              },
            ],
          },
          {
            href: "",
            label: "Applications",
            active: pathname.includes("/dashboard/app"),
            icon: File,
            submenus: [
              {
                href: "/dashboard/app/migration",
                label: "Migration",
                active: pathname === "/dashboard/app/migration",
                icon: RefreshCcwDot,
              },
              {
                href: "/dashboard/app/ban",
                label: "Ban",
                active: pathname === "/dashboard/app/ban",
                icon: Ban,
              },
              {
                href: "/dashboard/app/event",
                label: "Event",
                active: pathname === "/dashboard/app/event",
                icon: Calendar,
              },
              {
                href: "/dashboard/app/training",
                label: "Training",
                active: pathname === "/dashboard/app/training",
                icon: GitCompareArrows,
              },
            ],
          },
          {
            href: "",
            label: "Commitee",
            active: pathname.includes("/dashboard/commitee"),
            icon: UserCog,
            submenus: [
              {
                href: "/dashboard/commitee/create",
                label: "Create",
                active: pathname === "/dashboard/commitee/create",
                icon: Pen,
              },
              {
                href: "/dashboard/commitee/list",
                label: "List",
                active: pathname === "/dashboard/commitee/list",
                icon: List,
              },
            ],
          },
          {
            href: "",
            label: "Utils",
            active: pathname.includes("/dashboard/utils"),
            icon: SquareStack,
            submenus: [
              {
                href: "/dashboard/utils/fee",
                label: "Fee",
                active: pathname === "/dashboard/utils/fee",
                icon: CircleDollarSign,
              },
              {
                href: "/dashboard/utils/coupon",
                label: "Coupon",
                active: pathname === "/dashboard/utils/coupon",
                icon: BadgePercent,
              },
              {
                href: "/dashboard/utils/signature",
                label: "Signature",
                active: pathname === "/dashboard/utils/signature",
                icon: FileSignature,
              },
            ],
          },
        ],
      },
      {
        groupLabel: "Client",
        menus: [
          {
            href: "/dashboard/news",
            label: "News",
            active: pathname.includes("/dashboard/news"),
            icon: MicVocal,
            submenus: [
              {
                href: "/dashboard/news/create",
                label: "Create",
                active: pathname === "/dashboard/news/create",
                icon: Pen,
              },
              {
                href: "/dashboard/news",
                label: "List",
                active: pathname === "/dashboard/news",
                icon: List,
              },
            ],
          },
          {
            href: "/dashboard/gallery",
            label: "Gallery",
            active: pathname.includes("/dashboard/gallery"),
            icon: GalleryVertical,
            submenus: [
            ],
          },
          {
            href: "/dashboard/message",
            label: "Message",
            active: pathname.includes("/dashboard/message"),
            icon: MessageSquare,
            submenus: [
            ],
          },
          {
            href: "/dashboard/notice",
            label: "Notice",
            active: pathname.includes("/dashboard/notice"),
            icon: Bell,
            submenus: [
            ],
          },
        ],
      },
    ];
  }
  
  export function getMenuListUser(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname === "/dashboard",
            icon: LayoutGrid,
            submenus: [],
          },
          {
            href: "/dashboard/browse",
            label: "Browse",
            active: pathname === "/dashboard/browse",
            icon: Compass,
            submenus: [],
          },
          {
            href: "/dashboard/courses",
            label: "Courses",
            active: pathname === "/dashboard/courses",
            icon: BookOpen,
            submenus: [],
          },
          {
            href: "/dashboard/support",
            label: "Support",
            active: pathname === "/dashboard/support",
            icon: Headset,
            submenus: [],
          },
          {
            href: "/dashboard/profile",
            label: "Profile",
            active: pathname === "/dashboard/profile",
            icon: UserCog,
            submenus: [],
          },
        ],
      },
    ];
  }