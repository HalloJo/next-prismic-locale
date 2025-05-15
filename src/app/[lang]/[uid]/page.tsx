// ./src/app/[lang]/[uid]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

type Params = { uid: string; lang: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const client = createClient();
  // ⬇️ Note this line with the `lang` parameter being passed in
  const page = await client
    .getByUID("page", params.uid, { lang: params.lang })
    .catch(() => notFound());

  return {
    title: prismic.asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: [
        {
          url: page.data.meta_image.url || "",
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  // ⬇️ Note this line with the `lang` parameter being passed in
  const page = await client
    .getByUID("page", params.uid, {
      lang: params.lang,
    })
    .catch(() => notFound());

  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateStaticParams() {
  const client = createClient();

  // ⬇️ Note this line using a '*' for the lang parameter
  const pages = await client.getAllByType("page", {
    predicates: [prismic.filter.not("my.page.uid", "home")],
    lang: "*",
  });

  return pages.map((page) => ({ uid: page.uid, lang: page.lang }));
}
