import type { MetadataRoute } from "next";
import { readdirSync } from "fs";
import path from "path";

// Function to get all static routes from pages directory
function getStaticRoutes() {
  const pagesDirectory = path.join(process.cwd(), "app");
  const staticRoutes: string[] = [];

  function scanDirectory(dir: string, basePath: string = "") {
    try {
      const items = readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);

        // Skip directories with parentheses (route groups)
        if (item.name.startsWith("(") && item.name.endsWith(")")) {
          // Still scan inside route groups, but don't add the route group itself
          if (item.isDirectory()) {
            scanDirectory(fullPath, basePath); // Pass basePath unchanged
          }
          continue;
        }

        if (item.isDirectory()) {
          // Skip special Next.js directories
          if (
            ["api", "_app", "_document", "node_modules", ".next"].includes(
              item.name
            )
          ) {
            continue;
          }

          // Skip directories with dynamic routes (indicated by [])
          if (!item.name.includes("[")) {
            // Add directory as route if it's not a segment config
            if (!item.name.startsWith("_")) {
              staticRoutes.push(`${basePath}/${item.name}`);
            }

            // Recursively scan subdirectories
            scanDirectory(fullPath, `${basePath}/${item.name}`);
          }
        }
        // Check for page files (page.tsx, page.js, etc.)
        else if (item.name === "page.tsx" || item.name === "page.js") {
          // We found a page file, so this directory is a valid route
          if (basePath && !staticRoutes.includes(basePath)) {
            staticRoutes.push(basePath);
          }
        }
      }
    } catch (error) {
      console.error("Error scanning directory:", error);
    }
  }

  scanDirectory(pagesDirectory);
  return staticRoutes;
}

// Function to get blog posts
// function getBlogPosts() {
//   const blogPosts: string[] = [];
//   const contentDirectory = path.join(process.cwd(), "public/posts");

//   try {
//     const files = readdirSync(contentDirectory, { withFileTypes: true });

//     for (const file of files) {
//       if (
//         !file.isDirectory() &&
//         (file.name.endsWith(".md") || file.name.endsWith(".mdx"))
//       ) {
//         // Get slug from filename (remove extension)
//         const slug = file.name.replace(/\.(md|mdx)$/, "");
//         blogPosts.push(`/blog/${slug}`);
//       }
//     }
//   } catch (error) {
//     console.error("Error reading blog posts:", error);
//   }

//   return blogPosts;
// }

export default function sitemap(): MetadataRoute.Sitemap {
  // Get static routes
  const staticRoutes = getStaticRoutes();

  // Get blog posts
  // const blogPosts = getBlogPosts();

  // Combine routes
  const allRoutes = [...staticRoutes]; //, ...blogPosts

  // Generate sitemap entries
  const sitemap = allRoutes.map((route) => {
    const url = `https://calenderx.pro/${route === "/" ? "" : route}`;
    return {
      url,
      lastModified: new Date(),
      changeFrequency: route.startsWith("/blog/")
        ? ("weekly" as const)
        : ("monthly" as const),
      priority: route === "/" ? 1.0 : route.startsWith("/blog/") ? 0.9 : 0.8,
    };
  });

  return sitemap;
}
