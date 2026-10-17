import { algoliasearch } from "algoliasearch";
import { clientEnv } from "@/lib/env.client";

export const searchClient = clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID && clientEnv.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
  ? algoliasearch(clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID, clientEnv.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY)
  : null;
