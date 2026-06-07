import { PokeballCustomizer } from "../components/pokeball/PokeballCustomizer";
import { parseConfigFromSearchParams } from "../lib/pokeball/url";

export default async function Home({
  searchParams,
}: PageProps<"/">) {
  const initialConfig = parseConfigFromSearchParams(await searchParams);

  return <PokeballCustomizer initialConfig={initialConfig} />;
}
