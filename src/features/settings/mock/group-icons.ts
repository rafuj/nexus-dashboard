import type { ComponentType, SVGProps } from "react";

type SvgIcon = ComponentType<SVGProps<SVGSVGElement>>;

const iconModules = import.meta.glob(
  "@/assets/icons/group-icon/*.svg",
  {
    query: "?react",
    import: "default",
    eager: true,
  }
) as Record<string, SvgIcon>;

export const groupIcons = Object.entries(iconModules)
  .sort(([a], [b]) => {
    const aNum = Number(a.match(/icon-(\d+)\.svg/)?.[1]);
    const bNum = Number(b.match(/icon-(\d+)\.svg/)?.[1]);
    return aNum - bNum;
  })
  .map(([path, icon]) => ({
    id: path.match(/icon-(\d+)\.svg/)![0].replace(".svg", ""),
    icon,
  }));

export const selectedGroupIcon = (id: string) =>
  groupIcons.find((item) => item.id === id)?.icon;


// this is how we will use selected icon

// const SelectedIcon = selectedGroupIcon("icon-5");
// {SelectedIcon && <SelectedIcon className="size-10 text-primary" />}