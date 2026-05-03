import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "title" | "avatar" | "card" | "block";
}

function Skeleton({ className, variant = "block", ...props }: SkeletonProps) {
  const variantClass = {
    text: "skeleton skeleton-text",
    title: "skeleton skeleton-title",
    avatar: "skeleton skeleton-avatar",
    card: "skeleton-card",
    block: "skeleton",
  }[variant];

  return <div className={cn(variantClass, className)} {...props} />;
}

function SkeletonText({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="text" className={className} {...props} />;
}

function SkeletonTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="title" className={className} {...props} />;
}

function SkeletonAvatar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="avatar" className={className} {...props} />;
}

function SkeletonCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton variant="card" className={className} {...props}>
      {children}
    </Skeleton>
  );
}

export { Skeleton, SkeletonText, SkeletonTitle, SkeletonAvatar, SkeletonCard };
