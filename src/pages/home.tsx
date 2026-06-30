import { useState, useEffect, useRef } from "react";
import { logEvent } from "@/lib/log";

const ROBLOX_LINK = "https://www.roblox.com/share?code=1f9c510c988d284fa0f84f3f9d2a998a&type=Server";

const UGC_IDS = [
  { id: "11639243622", name: "Dragon Wings", price: "Grátis", category: "Back" },
  { id: "11639243623", name: "Neon Visor", price: "Grátis", category: "Face" },
  { id: "11639243624", name: "Gold Crown", price: "Grátis", category: "Hat" },
  { id: "11639243625", name: "Shadow Cape", price: "Grátis", category: "Back" },
  { id: "11639243626", name: "Cyber Mask", price: "Grátis", category: "Face" },
  { id: "11639243627", name: "Pixel Sword", price: "Grátis", category: "Gear" },
];

const LOCAL_IMAGES = [
  "/ugc-1.png",
  "/ugc-2.png",
  "/ugc-3.png",
  "/ugc-4.png",
  "/ugc-5.png",
  "/ugc-6.png",
];

const CATEGORIES = ["Todos", "Back", "Face", "Hat", "Gear"];

export default function Home() {
  const [selected, setSelected] = useState("Todos");
  const [search, setSearch] = useState("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    logEvent("Página visitada", { page: "Home" });
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.trim().length >= 2) {
      searchTimeout.current = setTimeout(() => {
        logEvent("Busca realizada", { termo: value });
      }, 800);
    }
  };

  const handleCategoryFilter = (cat: string) => {
    setSelected(cat);
    logEvent("Filtro aplicado", { categoria: cat });
  };

  const handleItemClick = (item: { id: string; name: string; category: string; price: string }) => {
    logEvent("Item clicado", {
      id: item.id,
      nome: item.name,
      categoria: item.category,
    });
  };

  const handleBuy = (item: { id: string; name: string; category: string; price: string }, e: React.MouseEvent) => {
    e.stopPropagation();
    logEvent("Botão pegar clicado", { nome: item.name, categoria: item.category });
    window.open(ROBLOX_LINK, "_blank", "noreferrer");
  };

  const items = UGC_IDS.map((ugc, i) => ({
    ...ugc,
    img: LOCAL_IMAGES[i % LOCAL_IMAGES.length],
  }));

  const filtered = items.filter((item) => {
    const matchCat = selected === "Todos" || item.category === selected;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-sm">B</div>
            <span className="text-lg font-bold">BestUGCs</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Catálogo</a>
            <a href="#" className="hover:text-white transition-colors">Rankings</a>
            <a href="#" className="hover:text-white transition-colors">Criadores</a>
          </nav>
          <a
            href="https://www.roblox.com/share?code=1f9c510c988d284fa0f84f3f9d2a998a&type=Server"
            target="_blank"
            rel="noreferrer"
            onClick={() => logEvent("Clicou em Abrir Roblox")}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Abrir Roblox
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-red-500/10 text-red-400 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-red-500/20">
            Comunidade Roblox UGC
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Os melhores <span className="text-red-400">UGCs</span> do Roblox
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Descubra, explore e encontre os itens UGC mais cobiçados da comunidade Roblox.
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="search"
              placeholder="Buscar UGCs..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8 flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === cat
                ? "bg-red-500 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            Nenhum UGC encontrado para "{search}"
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10 transition-all group cursor-pointer flex flex-col"
              >
                <div className="aspect-square bg-gray-800 relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-gray-950/80 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-green-400 font-bold">{item.price}</p>
                  <button
                    onClick={(e) => handleBuy(item, e)}
                    className="mt-auto w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white text-xs font-semibold py-1.5 rounded-lg transition-all"
                  >
                    Pegar Grátis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-600 text-sm">
        <p>© 2025 BestUGCs — Comunidade não oficial, não afiliada à Roblox Corporation.</p>
      </footer>
    </div>
  );
}
