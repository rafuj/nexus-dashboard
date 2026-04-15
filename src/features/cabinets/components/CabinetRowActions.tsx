"use client"

import { Link } from "react-router"
import { Eye, MoreHorizontal, Package, Pencil, Wrench } from "lucide-react"

import type { CabinetListRow } from "../types/cabinetList"
import { Button } from "@/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"

export function CabinetRowActions({ row }: { row: CabinetListRow }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          aria-label={`Actions for ${row.name}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to={`/cabinetview?cabinetId=${encodeURIComponent(row.id)}`}>
            <Eye className="size-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Package className="size-4" />
          Assign asset
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Wrench className="size-4" />
          Set maintenance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
