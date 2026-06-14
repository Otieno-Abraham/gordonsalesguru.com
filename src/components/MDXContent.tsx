import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import GordonInlineCTA from "./GordonInlineCTA";

/**
 * Renders MDX blog content at build time (RSC) with custom components.
 * Posts can use <GordonInlineCTA /> for a mid-article call-to-action.
 */

const components = {
  GordonInlineCTA,
  a: ({ href = "", children, ...rest }: any) => {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
};

export default function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose-gordon">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
