// ./src/app/[lang]/page.tsx

import { Metadata } from "next";
import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const client = createClient();
  // ⬇️ Note this line with the `lang` parameter being passed in
  const home = await client.getByUID("page", "home", { lang });

  return {
    title: prismic.asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title || undefined,
      images: [
        {
          url: home.data.meta_image.url || "",
        },
      ],
    },
  };
}

export default async function Index({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const client = createClient();
  // ⬇️ Note this line with the `lang` parameter being passed in
  const home = await client.getByUID("page", "home", {
    lang,
  });

  return <SliceZone slices={home.data.slices} components={components} />;
}
